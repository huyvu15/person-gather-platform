import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lấy tất cả posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const published = searchParams.get('published')
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
        { excerpt: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ]
    }

    // Only filter by isPublished if the parameter is explicitly provided
    if (published !== null) {
      where.isPublished = published === 'true'
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST - Tạo post mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      content, 
      excerpt, 
      imageUrl, 
      category, 
      tags, 
      isPublished, 
      isFeatured, 
      userId 
    } = body

    // Validation
    if (!title || !content || !userId) {
      return NextResponse.json(
        { error: 'Title, content and userId are required' },
        { status: 400 }
      )
    }

    // Generate excerpt if not provided
    const generatedExcerpt = excerpt || content.slice(0, 150) + (content.length > 150 ? '...' : '')

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        excerpt: generatedExcerpt,
        imageUrl: imageUrl?.trim() || null,
        category: category || 'general',
        tags: Array.isArray(tags) ? tags : [],
        isPublished: isPublished || false,
        isFeatured: isFeatured || false,
        userId
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
} 