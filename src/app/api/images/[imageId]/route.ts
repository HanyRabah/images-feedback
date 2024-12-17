// src/app/api/images/[imageId]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const image = await prisma.image.findUnique({
      where: { id: params.imageId }
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Delete the physical file
    const filepath = join(process.cwd(), 'public', image.url)
    try {
      await unlink(filepath)
    } catch (error) {
      console.error('Error deleting file:', error)
    }

    // Delete from database
    await prisma.image.delete({
      where: { id: params.imageId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Error deleting image' }, { status: 500 })
  }
}