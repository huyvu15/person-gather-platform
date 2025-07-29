import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Connect to database
    await prisma.$connect()

    // Get counts for different content types
    const [notesCount, postsCount, eventsCount] = await Promise.all([
      prisma.note.count({
        where: { userId }
      }),
      prisma.post.count({
        where: { userId }
      }),
      prisma.event.count({
        where: { userId }
      })
    ])

    // Get published posts count
    const publishedPostsCount = await prisma.post.count({
      where: { 
        userId,
        isPublished: true 
      }
    })

    // Get upcoming events (events from today onwards)
    const upcomingEventsCount = await prisma.event.count({
      where: {
        userId,
        startDate: {
          gte: new Date()
        }
      }
    })

    // Get total views from posts
    const totalViews = await prisma.post.aggregate({
      where: { userId },
      _sum: {
        viewCount: true
      }
    })

    // Get weekly activity (last 7 days)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const weeklyActivity = await prisma.note.count({
      where: {
        userId,
        createdAt: {
          gte: oneWeekAgo
        }
      }
    })

    // Get monthly growth (last 30 days)
    const oneMonthAgo = new Date()
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)

    const monthlyGrowth = await prisma.note.count({
      where: {
        userId,
        createdAt: {
          gte: oneMonthAgo
        }
      }
    })

    // Get weekly data for charts
    const weeklyData = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        const startOfDay = new Date(date.setHours(0, 0, 0, 0))
        const endOfDay = new Date(date.setHours(23, 59, 59, 999))

        const [notes, posts, events] = await Promise.all([
          prisma.note.count({
            where: {
              userId,
              createdAt: {
                gte: startOfDay,
                lte: endOfDay
              }
            }
          }),
          prisma.post.count({
            where: {
              userId,
              createdAt: {
                gte: startOfDay,
                lte: endOfDay
              }
            }
          }),
          prisma.event.count({
            where: {
              userId,
              createdAt: {
                gte: startOfDay,
                lte: endOfDay
              }
            }
          })
        ])

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return {
          day: dayNames[date.getDay()],
          notes,
          posts,
          events,
          views: posts * 10 // Mock views based on posts
        }
      })
    )

    // Get category distribution
    const categoryData = await Promise.all([
      prisma.note.count({ where: { userId } }),
      prisma.post.count({ where: { userId } }),
      prisma.event.count({ where: { userId } }),
      // Mock memories count for now
      Promise.resolve(45)
    ])

    const totalContent = categoryData.reduce((sum, count) => sum + count, 0)
    const categoryDistribution = [
      { name: 'Notes', value: totalContent > 0 ? Math.round((categoryData[0] / totalContent) * 100) : 0, color: '#3B82F6' },
      { name: 'Posts', value: totalContent > 0 ? Math.round((categoryData[1] / totalContent) * 100) : 0, color: '#10B981' },
      { name: 'Events', value: totalContent > 0 ? Math.round((categoryData[2] / totalContent) * 100) : 0, color: '#F59E0B' },
      { name: 'Memories', value: totalContent > 0 ? Math.round((categoryData[3] / totalContent) * 100) : 0, color: '#EF4444' }
    ]

    // Disconnect from database
    await prisma.$disconnect()

    return NextResponse.json({
      stats: {
        notes: notesCount,
        posts: publishedPostsCount,
        events: upcomingEventsCount,
        memories: 45, // Mock for now
        totalViews: totalViews._sum.viewCount || 0,
        totalLikes: 340, // Mock for now
        weeklyActivity,
        monthlyGrowth
      },
      charts: {
        weeklyData,
        categoryDistribution,
        monthlyData: [
          { month: 'Jan', growth: 12, posts: 8, events: 15 },
          { month: 'Feb', growth: 18, posts: 12, events: 22 },
          { month: 'Mar', growth: 25, posts: 15, events: 28 },
          { month: 'Apr', growth: 22, posts: 18, events: 25 },
          { month: 'May', growth: 30, posts: 20, events: 35 },
          { month: 'Jun', growth: 28, posts: 25, events: 32 },
        ],
        activityData: [
          { time: '00:00', activity: 5 },
          { time: '04:00', activity: 2 },
          { time: '08:00', activity: 15 },
          { time: '12:00', activity: 25 },
          { time: '16:00', activity: 30 },
          { time: '20:00', activity: 20 },
          { time: '24:00', activity: 8 },
        ]
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
} 