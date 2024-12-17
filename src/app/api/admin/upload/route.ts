import { mkdir, writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import { join } from 'path'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.formData()
    const file = data.get('file') as File
    const folderId = data.get('folderId') as string

    if (!file || !folderId) {
      return NextResponse.json(
        { error: 'File and folderId are required.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    // Save file
    const filename = `${Date.now()}-${file.name}`
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Create database record
    const image = await prisma.image.create({
      data: {
        filename,
        url: `/uploads/${filename}`,
        folderId
      }
    })

    return NextResponse.json({ image })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    )
  }
}