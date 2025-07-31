import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Cache for presigned URLs
const urlCache = new Map<string, { url: string; expires: number }>()
const CACHE_DURATION = 50 * 60 * 1000 // 50 minutes

// Get region from environment or default to ap-southeast-1
const getS3Region = () => {
  return process.env.AWS_REGION || 'ap-southeast-1'
}

const s3Client = new S3Client({
  region: getS3Region(),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  maxAttempts: 3,
  requestHandler: {
    httpOptions: {
      timeout: 10000, // 10 seconds
    },
  },
  // Force path-style URLs for better compatibility
  forcePathStyle: true,
})

export interface S3Image {
  key: string
  url: string
  lastModified: Date
  size: number
  contentType: string
  folder: string
  tags: string[]
  userId: string
}

export interface FilterOptions {
  folder?: string
  dateRange?: string
  tags?: string[]
  favorites?: boolean
  search?: string
  userId?: string
}

// Helper function to get user-specific folder path
function getUserFolderPath(userId: string): string {
  const baseFolder = process.env.AWS_S3_FOLDER_PATH || 'Pictures/'
  return `${baseFolder}users/${userId}/`
}

async function getPresignedUrl(key: string): Promise<string> {
  const now = Date.now()
  const cached = urlCache.get(key)
  
  if (cached && cached.expires > now) {
    return cached.url
  }

  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME!
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
    
    const presignedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 3600, // 1 hour
    })

    urlCache.set(key, {
      url: presignedUrl,
      expires: now + CACHE_DURATION,
    })

    return presignedUrl
  } catch (error) {
    console.error('Error generating presigned URL for', key, error)
    throw error
  }
}

export async function listImagesFromS3(userId: string, filters?: FilterOptions): Promise<S3Image[]> {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME!
    const userFolder = getUserFolderPath(userId)
    
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: userFolder,
      MaxKeys: 50, // Giảm số lượng để tối ưu hơn
    })

    const response = await s3Client.send(command)
    
    if (!response.Contents) {
      return []
    }

    const images: S3Image[] = []
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']

    // Filter và process images
    for (const object of response.Contents) {
      if (!object.Key) continue
      
      // Filter for image files
      const isImage = imageExtensions.some(ext => 
        object.Key!.toLowerCase().endsWith(ext)
      )
      
      if (!isImage) continue

      // Extract folder from key (relative to user folder)
      const relativePath = object.Key!.replace(userFolder, '')
      const folder = relativePath.split('/')[0] || 'root'

      // Generate tags
      const tags = generateTagsFromKey(object.Key, folder)

      const image: S3Image = {
        key: object.Key,
        url: '', // Will be filled later
        lastModified: (() => {
          // Ensure we have a valid date
          const date = object.LastModified || new Date()
          return isNaN(date.getTime()) ? new Date() : date
        })(),
        size: object.Size || 0,
        contentType: 'image/jpeg',
        folder,
        tags,
        userId,
      }

      // Apply filters
      if (filters) {
        if (filters.folder && filters.folder !== 'all' && image.folder !== filters.folder) {
          continue
        }
        
        if (filters.dateRange) {
          const imageDate = image.lastModified
          const now = new Date()
          
          // Skip invalid dates
          if (isNaN(imageDate.getTime())) {
            continue
          }
          
          switch (filters.dateRange) {
            case 'today':
              const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
              if (imageDate < today) continue
              break
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
              if (imageDate < weekAgo) continue
              break
            case 'month':
              const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
              if (imageDate < monthAgo) continue
              break
            case 'year':
              const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
              if (imageDate < yearAgo) continue
              break
          }
        }

        if (filters.tags && filters.tags.length > 0) {
          const hasMatchingTag = filters.tags.some(tag => image.tags.includes(tag))
          if (!hasMatchingTag) continue
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          const filename = object.Key.split('/').pop() || ''
          if (!filename.toLowerCase().includes(searchLower)) continue
        }
      }

      images.push(image)
    }

    // Sort by last modified date (newest first)
    const sortedImages = images.sort((a, b) => {
      const aTime = a.lastModified.getTime()
      const bTime = b.lastModified.getTime()
      
      // Handle invalid dates
      if (isNaN(aTime) && isNaN(bTime)) return 0
      if (isNaN(aTime)) return 1
      if (isNaN(bTime)) return -1
      
      return bTime - aTime
    })

    // Generate presigned URLs in parallel (limited to 5 at a time for better performance)
    const batchSize = 5
    for (let i = 0; i < sortedImages.length; i += batchSize) {
      const batch = sortedImages.slice(i, i + batchSize)
      await Promise.all(
        batch.map(async (image) => {
          try {
            image.url = await getPresignedUrl(image.key)
          } catch (error) {
            // Use a placeholder or skip this image
            image.url = '/api/placeholder/400/400'
          }
        })
      )
    }

    return sortedImages
  } catch (error) {
    // Return empty array instead of throwing to prevent app crash
    return []
  }
}

export async function getFolders(userId: string): Promise<string[]> {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME!
    const userFolder = getUserFolderPath(userId)
    
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: userFolder,
      Delimiter: '/',
    })

    const response = await s3Client.send(command)
    
    if (!response.CommonPrefixes) {
      return []
    }

    return response.CommonPrefixes
      .map(prefix => prefix.Prefix?.replace(userFolder, '').replace('/', '') || '')
      .filter(folder => folder.length > 0)
  } catch (error) {
    console.error('Error getting folders:', error)
    return []
  }
}

// New function to upload image to user-specific folder
export async function uploadImageToS3(
  userId: string, 
  file: Buffer, 
  filename: string, 
  contentType: string,
  folder?: string
): Promise<{ success: boolean; key?: string; error?: string }> {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME!
    const userFolder = getUserFolderPath(userId)
    
    // Create key with optional folder
    const key = folder 
      ? `${userFolder}${folder}/${filename}`
      : `${userFolder}${filename}`
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
      Metadata: {
        userId,
        uploadedAt: new Date().toISOString(),
        folder: folder || 'root'
      }
    })

    await s3Client.send(command)
    
    return { success: true, key }
  } catch (error) {
    let errorMessage = 'Failed to upload image'
    if (error instanceof Error) {
      if (error.message.includes('AccessDenied')) {
        errorMessage = 'Access denied to S3 bucket. Check AWS credentials and permissions.'
      } else if (error.message.includes('NoSuchBucket')) {
        errorMessage = 'S3 bucket does not exist. Check bucket name configuration.'
      } else if (error.message.includes('InvalidAccessKeyId')) {
        errorMessage = 'Invalid AWS access key. Check AWS credentials.'
      } else {
        errorMessage = error.message
      }
    }
    
    return { success: false, error: errorMessage }
  }
}

// New function to delete image from S3
export async function deleteImageFromS3(
  userId: string,
  imageKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME!
    
    // Verify the image belongs to the user
    const userFolder = getUserFolderPath(userId)
    if (!imageKey.startsWith(userFolder)) {
      return { success: false, error: 'Image does not belong to user' }
    }
    
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: imageKey,
    })

    await s3Client.send(command)
    
    // Clear cache for this image
    urlCache.delete(imageKey)
    
    return { success: true }
  } catch (error) {
    let errorMessage = 'Failed to delete image'
    if (error instanceof Error) {
      if (error.message.includes('AccessDenied')) {
        errorMessage = 'Access denied to S3 bucket. Check AWS credentials and permissions.'
      } else if (error.message.includes('NoSuchBucket')) {
        errorMessage = 'S3 bucket does not exist. Check bucket name configuration.'
      } else if (error.message.includes('NoSuchKey')) {
        errorMessage = 'Image not found in S3 bucket.'
      } else if (error.message.includes('InvalidAccessKeyId')) {
        errorMessage = 'Invalid AWS access key. Check AWS credentials.'
      } else {
        errorMessage = error.message
      }
    }
    
    return { success: false, error: errorMessage }
  }
}

function generateTagsFromKey(key: string, folder: string): string[] {
  const tags: string[] = []
  
  // Add folder as tag
  tags.push(folder)
  
  // Add tags based on filename
  const filename = key.toLowerCase()
  if (filename.includes('family') || filename.includes('family')) tags.push('family')
  if (filename.includes('travel') || filename.includes('vacation')) tags.push('travel')
  if (filename.includes('work') || filename.includes('office')) tags.push('work')
  if (filename.includes('food') || filename.includes('meal')) tags.push('food')
  if (filename.includes('nature') || filename.includes('landscape')) tags.push('nature')
  if (filename.includes('portrait') || filename.includes('people')) tags.push('portrait')
  
  return Array.from(new Set(tags)) // Remove duplicates
} 