// src/app/api/admin/folders/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    // Log the incoming request
    console.log('Received request to create folder')

    const session = await getServerSession(authOptions)
    console.log('Session:', session)
    
    if (!session || session.user.role !== 'ADMIN') {
      console.log('Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and log the request body
    const body = await request.json()
    console.log('Request body:', body)

    const { name, clientId } = body

    if (!name || !clientId) {
      console.log('Missing required fields:', { name, clientId })
      return NextResponse.json({ 
        error: 'Name and clientId are required',
        received: { name, clientId } 
      }, { status: 400 })
    }

    // Verify client exists before creating folder
    const client = await prisma.user.findUnique({
      where: { id: clientId }
    })

    if (!client) {
      console.log('Client not found:', clientId)
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        clientId
      }
    })

    console.log('Folder created successfully:', folder)
    return NextResponse.json({ folder })

  } catch (error) {
    // Log the full error
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })

    return NextResponse.json({ 
      error: 'Error creating folder',
      details: error.message 
    }, { status: 500 })
  }
}