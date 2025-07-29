import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lấy tất cả events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    let where: any = { userId }

    if (startDate && endDate) {
      where.OR = [
        {
          startDate: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        {
          endDate: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        {
          AND: [
            { startDate: { lte: new Date(startDate) } },
            { endDate: { gte: new Date(endDate) } }
          ]
        }
      ]
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: 'asc' }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST - Tạo event mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      description, 
      startDate, 
      endDate, 
      allDay, 
      color, 
      category, 
      location, 
      attendees, 
      isRecurring, 
      recurrence, 
      priority,
      userId
    } = body

    // Validation
    if (!title || !startDate || !endDate || !userId) {
      return NextResponse.json(
        { error: 'Title, startDate, endDate and userId are required' },
        { status: 400 }
      )
    }

    // Parse and validate dates
    let parsedStartDate, parsedEndDate
    try {
      parsedStartDate = new Date(startDate)
      parsedEndDate = new Date(endDate)
      
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Validate date range
    if (parsedStartDate >= parsedEndDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        allDay: allDay || false,
        color: color || 'blue',
        category: category || 'general',
        location: location?.trim() || null,
        attendees: Array.isArray(attendees) ? attendees : [],
        isRecurring: isRecurring || false,
        recurrence: recurrence || null,
        priority: priority || 'medium',
        isCompleted: false,
        userId
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
} 