// src/app/api/images/[imageId]/feedback/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { comment } = body

    if (!comment) {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 })
    }

    const feedback = await prisma.feedback.create({
      data: {
        comment,
        status: 'PENDING',
        imageId: params.imageId,
        userId: session.user.id
      }
    })

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error('Error creating feedback:', error)
    return NextResponse.json({ error: 'Error creating feedback' }, { status: 500 })
  }
}

// Get all feedback for an image
export async function GET(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const feedback = await prisma.feedback.findMany({
      where: { 
        imageId: params.imageId,
        // If client, only show their own feedback
        ...(session.user.role === 'CLIENT' && {
          userId: session.user.id
        })
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json({ error: 'Error fetching feedback' }, { status: 500 })
  }
}
