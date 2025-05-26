import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

console.log('API Route: /api/schools initialized');

export const dynamic = 'force-dynamic';

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
  console.log('POST request received');
  
  try {
    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    
    console.log('Parsing request body...');
    const schoolData = await request.json();
    console.log('Received data:', schoolData);
    
    // Validate required fields
    if (!schoolData.name || !schoolData.city) {
      console.log('Validation failed - missing name or city');
      return NextResponse.json(
        { error: 'Name and city are required fields' },
        { status: 400 }
      );
    }

    // Generate unique ID if not provided
    if (!schoolData.id) {
      schoolData.id = new ObjectId().toString();
      console.log('Generated ID:', schoolData.id);
    }

    console.log('Inserting school data...');
    const result = await db.collection('schools').insertOne(schoolData);
    console.log('Insert result:', result);
    
    const response = NextResponse.json(
      { 
        success: true,
        insertedId: result.insertedId,
        message: 'School added successfully'
      },
      { 
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    console.log('Returning successful response');
    return response;
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      { error: 'Failed to create school' },
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
