// src/app/api/test/auth/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Log authentication attempt details (remove in production)
    const authCheck = {
      userFound: !!user,
      passwordProvided: !!password,
      storedHash: user?.password,
      passwordMatch: user ? await bcrypt.compare(password, user.password) : false
    }

    return NextResponse.json({
      status: 'success',
      authCheck
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 })
  }
}