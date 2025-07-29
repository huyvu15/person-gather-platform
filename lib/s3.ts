import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Cache for presigned URLs
const urlCache = new Map<string, { url: string; expires: number }>()
const CACHE_DURATION = 50 * 60 * 1000 // 50 minutes

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
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
})

export interface S3Image {
  key: string
  url: string
  lastModified: Date
  size: number
  contentType: string
  folder: string
  tags: string[]
}

export interface FilterOptions {
  folder?: string
  dateRange?: string
  tags?: string[]
  favorites?: boolean
  search?: string
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

export async function listImagesFromS3(filters?: FilterOptions): Promise<S3Image[]> {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME!
    const baseFolder = process.env.AWS_S3_FOLDER_PATH || 'Pictures/'
    
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: baseFolder,
      MaxKeys: 100, // Giảm số lượng để tối ưu
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

      // Extract folder from key
      const relativePath = object.Key!.replace(baseFolder, '')
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

    // Generate presigned URLs in parallel (limited to 10 at a time)
    const batchSize = 10
    for (let i = 0; i < sortedImages.length; i += batchSize) {
      const batch = sortedImages.slice(i, i + batchSize)
      await Promise.all(
        batch.map(async (image) => {
          try {
            image.url = await getPresignedUrl(image.key)
          } catch (error) {
            console.error('Error getting presigned URL for', image.key, error)
            // Use a placeholder or skip this image
            image.url = '/api/placeholder/400/400'
          }
        })
      )
    }

    return sortedImages
  } catch (error) {
    console.error('Error listing images from S3:', error)
    // Return empty array instead of throwing to prevent app crash
    return []
  }
}

export async function getFolders(): Promise<string[]> {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME!
    const baseFolder = process.env.AWS_S3_FOLDER_PATH || 'Pictures/'
    
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: baseFolder,
      Delimiter: '/',
    })

    const response = await s3Client.send(command)
    
    if (!response.CommonPrefixes) {
      return []
    }

    return response.CommonPrefixes
      .map(prefix => prefix.Prefix?.replace(baseFolder, '').replace('/', '') || '')
      .filter(folder => folder.length > 0)
  } catch (error) {
    console.error('Error getting folders:', error)
    return []
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