import { NextResponse } from 'next/server'
import { listImagesFromS3 } from '@/lib/s3'

export async function GET() {
  try {
    const images = await listImagesFromS3()
    return NextResponse.json(images)
  } catch (error) {
    console.error('Error loading images:', error)
    return NextResponse.json({ error: 'Failed to load images' }, { status: 500 })
  }
} 