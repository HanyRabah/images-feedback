// src/app/api/feedback/[feedbackId]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  request: Request,
  { params }: { params: { feedbackId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the feedback first to check ownership
    const feedback = await prisma.feedback.findUnique({
      where: { id: params.feedbackId }
    })

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 })
    }

    // Only allow deletion if user is admin or feedback owner
    if (session.user.role !== 'ADMIN' && session.user.id !== feedback.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete the feedback
    await prisma.feedback.delete({
      where: { id: params.feedbackId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting feedback:', error)
    return NextResponse.json({ error: 'Error deleting feedback' }, { status: 500 })
  }
}