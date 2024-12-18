// app/api/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get('file') as File;
  const folderId = form.get('folderId') as string;

  if (!file || !folderId) {
    return NextResponse.json(
      { error: 'File and folderId are required.' },
      { status: 400 }
    );
  }

  try {
    const blob = await put(file.name, file, {
      access: 'public',
    });

    const image = await prisma.image.create({
      data: {
        filename: file.name,
        url: blob.url,
        folderId
      }
    });

    return NextResponse.json({ image });
  } catch (error) {
    console.error('Error uploading:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}