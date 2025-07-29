import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lấy tất cả posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const isPublished = searchParams.get('published') === 'true'

    const where: any = {}

    // Chỉ lọc theo isPublished nếu có tham số published
    if (searchParams.has('published')) {
      where.isPublished = isPublished
    }

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

    console.log('API query where:', where) // Debug log

    const posts = await prisma.post.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    console.log('API returned posts:', posts.length) // Debug log

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Tạo post mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, imageUrl, category, tags } = body

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Tạo excerpt tự động nếu không có
    const autoExcerpt = excerpt || content.substring(0, 150) + (content.length > 150 ? '...' : '')

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        excerpt: autoExcerpt,
        imageUrl: imageUrl?.trim() || null,
        category: category || 'general',
        tags: Array.isArray(tags) ? tags : [],
        isPublished: false,
        isFeatured: false,
        viewCount: 0
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    
    // Log chi tiết lỗi để debug
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create post', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 