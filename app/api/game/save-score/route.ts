import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/game/save-score - Starting request')
    
    const body = await request.json()
    const { score, duration, moves, maxTile, gameType } = body

    console.log('Received game score data:', { score, duration, moves, maxTile, gameType })

    // Validation
    if (!score || typeof score !== 'number') {
      console.log('Validation failed: missing or invalid score')
      return NextResponse.json(
        { error: 'Score is required and must be a number' },
        { status: 400 }
      )
    }

    // Get user ID from request headers or session
    // For now, we'll use a placeholder - in a real app, you'd get this from authentication
    const userId = request.headers.get('user-id') || 'default-user-id'

    // Test database connection first
    try {
      await prisma.$connect()
      console.log('✅ Database connected successfully')
    } catch (connectError) {
      console.error('❌ Database connection failed:', connectError)
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Save game score
    console.log('Saving game score to database...')
    const gameScore = await prisma.gameScore.create({
      data: {
        score,
        gameType: gameType || '2048',
        duration: duration || null,
        moves: moves || null,
        maxTile: maxTile || null,
        userId
      },
      select: {
        id: true,
        score: true,
        gameType: true,
        duration: true,
        moves: true,
        maxTile: true,
        createdAt: true
      }
    })

    console.log('Game score saved successfully:', gameScore.id)

    // Disconnect from database
    await prisma.$disconnect()
    console.log('✅ Database disconnected successfully')

    return NextResponse.json(
      { 
        message: 'Game score saved successfully',
        gameScore 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving game score:', error)
    
    // Log chi tiết lỗi để debug
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { error: 'Failed to save game score' },
      { status: 500 }
    )
  }
} 