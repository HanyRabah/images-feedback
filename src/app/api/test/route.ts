// src/app/api/test/route.ts
import { NextResponse } from 'next/server'
import { prisma, testConnection } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const isConnected = await testConnection()
    
    // Test user query
    const userCount = await prisma.user.count()
    
    // Test environment variables
    const envCheck = {
      hasDbUrl: !!process.env.DATABASE_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    }

    return NextResponse.json({
      status: 'success',
      dbConnection: isConnected,
      userCount,
      envCheck,
    })
  } catch (error) {
    console.error('Test route error:', error)
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 })
  }
}