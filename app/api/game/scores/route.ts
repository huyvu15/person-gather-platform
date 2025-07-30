import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/game/scores - Starting request')
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const gameType = searchParams.get('gameType') || '2048'
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

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

    // Get game scores
    console.log('Fetching game scores for user:', userId)
    const scores = await prisma.gameScore.findMany({
      where: {
        userId,
        gameType
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
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

    // Get best score
    const bestScore = await prisma.gameScore.findFirst({
      where: {
        userId,
        gameType
      },
      orderBy: {
        score: 'desc'
      },
      select: {
        score: true
      }
    })

    // Get total games played
    const totalGames = await prisma.gameScore.count({
      where: {
        userId,
        gameType
      }
    })

    console.log('Game scores fetched successfully')

    // Disconnect from database
    await prisma.$disconnect()
    console.log('✅ Database disconnected successfully')

    return NextResponse.json({
      scores,
      bestScore: bestScore?.score || 0,
      totalGames,
      gameType
    })
  } catch (error) {
    console.error('Error fetching game scores:', error)
    
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch game scores' },
      { status: 500 }
    )
  }
} 