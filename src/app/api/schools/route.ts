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
  console.log('POST /api/schools received');
  
  try {
    console.log('Connecting to MongoDB...');
    const { db } = await connectToDatabase();
    console.log('Successfully connected to MongoDB');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const validatedData = schoolSchema.parse({
      ...body,
      country: body.country || 'United States',
      instructionInEnglish: body.instructionInEnglish || true,
      publicPrivate: body.publicPrivate || 'private',
      boardingOption: body.boardingOption || false,
      principal: body.principal || 'Not specified'
    });
    console.log('Validated data:', validatedData);
    
    console.log('Inserting school into database...');
    const result = await db.collection('schools').insertOne(validatedData);
    console.log('Insert result:', result);
    
    return NextResponse.json(
      { id: result.insertedId, ...validatedData },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in POST /api/schools:', errorMessage, error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
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
