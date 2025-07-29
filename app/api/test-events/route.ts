import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Test query
    const eventCount = await prisma.event.count()
    const noteCount = await prisma.note.count()
    const postCount = await prisma.post.count()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      eventCount,
      noteCount,
      postCount
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 