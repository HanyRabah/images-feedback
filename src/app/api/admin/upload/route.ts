// app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get('file') as File;
    const folderId = form.get('folderId') as string;

    if (!file || !folderId) {
      return NextResponse.json(
        { error: 'File and folderId are required.' },
        { status: 400 }
      );
    }

    // Verify folder exists and user has access
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { client: true }
    });

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: 'public',
      addRandomSuffix: true, // Adds random suffix for uniqueness
    });

    // Save to database
    const image = await prisma.image.create({
      data: {
        filename: file.name,
        url: blob.url,
        folderId
      }
    });

    return NextResponse.json({ 
      success: true,
      image: {
        id: image.id,
        url: image.url,
        filename: image.filename
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}