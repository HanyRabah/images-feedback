// src/app/api/admin/clients/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, name, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const client = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'CLIENT'
      }
    })

    // Remove password from response
    const { ...clientWithoutPassword } = client

    return NextResponse.json({ client: clientWithoutPassword })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: 'Error creating client' }, { status: 500 })
  }
}


export async function DELETE(
    request: Request, 
  ) {
    const body = await request.json()
    const { clientId } = body
    try {
      const session = await getServerSession(authOptions)
      
      if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
  
      // Get all images to delete files
      const images = await prisma.image.findMany({
        where: {
          folder: {
            clientId
          }
        }
      })
  
      // Delete physical image files
      for (const image of images) {
        try {
          const filepath = join(process.cwd(), 'public', image.url)
          await unlink(filepath)
        } catch (error) {
          console.error('Error deleting file:', error)
        }
      }
  
      // Delete client and all related data (cascading delete)
      await prisma.user.delete({
        where: { id: clientId }
      })
  
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error deleting client:', error)
      return NextResponse.json({ error: 'Error deleting client' }, { status: 500 })
    }
  }