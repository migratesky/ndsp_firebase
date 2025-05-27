import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { z } from 'zod';
import { Content } from '@/models/content';

const contentSchema = z.object({
  title: z.string().min(2).max(100),
  type: z.enum(['article', 'video', 'resource']),
  published: z.boolean(),
  content: z.string().min(10).max(10000),
  description: z.string().max(200).optional(),
  tags: z.array(z.string().max(20)).max(10).optional(),
  thumbnailUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional().refine(
    val => !val || val.includes('youtube.com') || val.includes('vimeo.com'), 
    'Must be a YouTube or Vimeo URL'
  )
});

const contentUpdateSchema = contentSchema.extend({
  id: z.string().min(1, 'ID is required')
});

console.log('API Route Handler Initialized');

export { contentSchema };

export async function GET() {
  try {
    await connectToDB();
    const contents = await Content.find().lean();
    return NextResponse.json(contents);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contentSchema.parse(body);
    
    await connectToDB();
    const newContent = await Content.create(validated);
    
    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Validation or creation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = contentUpdateSchema.parse(body);
    
    await connectToDB();
    const updatedContent = await Content.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!updatedContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedContent);
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Validation or update failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}
