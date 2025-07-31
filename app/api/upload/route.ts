import { NextRequest, NextResponse } from 'next/server'
import { uploadImageToS3 } from '@/lib/s3'
import { authenticateUserFromFormData } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Authenticate user
    const user = await authenticateUserFromFormData(formData)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const folder = formData.get('folder') as string || 'memories'
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const results = []
    const errors = []

    for (const file of files) {
      try {
        // Validate file
        if (!file.type.startsWith('image/')) {
          errors.push(`File ${file.name} is not an image`)
          continue
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          errors.push(`File ${file.name} is too large (max 10MB)`)
          continue
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer())
        
        // Generate unique filename
        const timestamp = Date.now()
        const extension = file.name.split('.').pop() || 'jpg'
        const filename = `${timestamp}_${file.name}`

        // Upload to S3
        const result = await uploadImageToS3(
          user.id,
          buffer,
          filename,
          file.type,
          folder
        )

        if (result.success) {
          results.push({
            filename: file.name,
            key: result.key,
            size: file.size
          })
        } else {
          errors.push(`Failed to upload ${file.name}: ${result.error}`)
        }
      } catch (error) {
        errors.push(`Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: results.length > 0,
      uploaded: results,
      errors,
      summary: {
        successful: results.length,
        failed: errors.length
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 