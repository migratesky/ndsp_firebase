import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

console.log('API Route: /api/schools initialized');

export const dynamic = 'force-dynamic';

const schoolSchema = z.object({
  name: z.string().min(2).max(100),
  country: z.string().min(2).max(56),
  city: z.string().min(2).max(85),
  address: z.string().min(5).max(200),
  website: z.string().url().optional(),
  phone: z.string().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.0-9]{8,15}$/),
  gradesServed: z.string().regex(/^([A-Za-z]+-)?\d+$/),
  instructionInEnglish: z.boolean(),
  publicPrivate: z.enum(['public', 'private', 'charter']),
  boardingOption: z.boolean(),
  boardingDetails: z.string().max(500).optional(),
  accreditation: z.string().max(100).optional(),
  email: z.string().email(),
  principal: z.string().min(2).max(100)
});

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const schools = await db.collection('schools').find().toArray();
    
    return NextResponse.json(
      schools,
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    console.log('Received school data:', body);
    
    try {
      const validatedData = schoolSchema.parse(body);
      console.log('Validated school data:', validatedData);
      
      // Drop any problematic unique index on id field
      try {
        await db.collection('schools').dropIndex('id_1');
      } catch (e) {
        // Ignore if index doesn't exist
        console.log('Index id_1 not found or already dropped');
      }
      
      const result = await db.collection('schools').insertOne({
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return NextResponse.json(
        { success: true, id: result.insertedId },
        { 
          status: 201,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationError instanceof Error ? validationError.message : validationError 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create school', details: error },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  console.log('OPTIONS request received');
  const response = new NextResponse(null, { 
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
