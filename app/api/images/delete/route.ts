import { NextRequest, NextResponse } from 'next/server'
import { deleteImageFromS3 } from '@/lib/s3'
import { authenticateUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Read request body first
    const body = await request.json()
    const { imageKey, userId } = body
    
    if (!imageKey) {
      return NextResponse.json({ error: 'Image key is required' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Create a new request with the body for authentication
    const authRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ userId })
    })

    // Authenticate user
    const user = await authenticateUser(authRequest)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete image from S3
    const result = await deleteImageFromS3(user.id, imageKey)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Image deleted successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 