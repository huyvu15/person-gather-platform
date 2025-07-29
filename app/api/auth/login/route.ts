import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/auth/login - Starting request')
    
    const body = await request.json()
    const { email, password } = body

    console.log('Received login data:', { email, passwordLength: password?.length })

    // Validation
    if (!email || !password) {
      console.log('Validation failed: missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
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

    // Find user by email
    console.log('Finding user by email:', email)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (!user) {
      console.log('User not found:', email)
      await prisma.$disconnect()
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('User account deactivated:', email)
      await prisma.$disconnect()
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      )
    }

    // Verify password
    console.log('Verifying password...')
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email)
      await prisma.$disconnect()
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('Login successful for user:', email)

    // Disconnect from database
    await prisma.$disconnect()
    console.log('✅ Database disconnected successfully')

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt
    }

    return NextResponse.json(
      { 
        message: 'Login successful',
        user: userData
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error during login:', error)
    
    // Log chi tiết lỗi để debug
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
} 