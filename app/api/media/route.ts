import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const mediaFiles = await prisma.mediaFile.findMany({
      include: {
        metadata: true,
        analytics: true,
      },
    })
    return NextResponse.json(mediaFiles)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch media files' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const mediaFile = await prisma.mediaFile.create({
      data: {
        ...data,
        metadata: {
          create: data.metadata
        }
      },
      include: {
        metadata: true
      }
    })
    return NextResponse.json(mediaFile)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create media file' },
      { status: 500 }
    )
  }
} 