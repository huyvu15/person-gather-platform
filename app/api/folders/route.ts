import { NextRequest, NextResponse } from 'next/server'
import { getFolders } from '@/lib/s3'
import { authenticateUser } from '@/lib/auth'

async function handleFoldersRequest(request: NextRequest) {
  try {
    // Read request body first
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Create a new request for authentication
    const authRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ userId })
    })

    const user = await authenticateUser(authRequest)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const folders = await getFolders(userId)
    return NextResponse.json(folders)

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return handleFoldersRequest(request)
}

export async function POST(request: NextRequest) {
  return handleFoldersRequest(request)
} 