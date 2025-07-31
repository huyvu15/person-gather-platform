import { NextRequest } from 'next/server'
import { prisma } from './prisma'

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
}

// Simple cache for user authentication
const userCache = new Map<string, { user: AuthenticatedUser; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function authenticateUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const contentType = request.headers.get('content-type') || ''
    
    let userId: string | undefined

    if (contentType.includes('application/json')) {
      const body = await request.json()
      userId = body.userId
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      userId = formData.get('userId') as string
    }

    if (!userId) {
      return null
    }

    // Check cache first
    const cached = userCache.get(userId)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.user
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    })

    if (user) {
      // Cache the user
      userCache.set(userId, { user, timestamp: Date.now() })
    }

    return user
  } catch (error) {
    return null
  }
}

export async function authenticateUserFromFormData(formData: FormData): Promise<AuthenticatedUser | null> {
  try {
    const userId = formData.get('userId') as string
    
    if (!userId) {
      return null
    }

    // Check cache first
    const cached = userCache.get(userId)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.user
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    })

    if (user) {
      // Cache the user
      userCache.set(userId, { user, timestamp: Date.now() })
    }

    return user
  } catch (error) {
    return null
  }
} 