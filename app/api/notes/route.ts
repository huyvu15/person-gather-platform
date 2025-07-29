import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lấy tất cả notes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
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

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ]
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

// POST - Tạo note mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, category, tags, color, userId } = body

    if (!title || !content || !userId) {
      return NextResponse.json(
        { error: 'Title, content and userId are required' },
        { status: 400 }
      )
    }

    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category || 'general',
        tags: Array.isArray(tags) ? tags : [],
        color: color || 'blue',
        userId
      }
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
} 