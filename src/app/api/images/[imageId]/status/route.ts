// src/app/api/images/[imageId]/status/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!['PENDING', 'APPROVED', 'PASSED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const image = await prisma.image.update({
      where: { id: params.imageId },
      data: { status }
    })

    return NextResponse.json({ image })
  } catch (error) {
    console.error('Error updating image status:', error)
    return NextResponse.json({ error: 'Error updating image status' }, { status: 500 })
  }
}