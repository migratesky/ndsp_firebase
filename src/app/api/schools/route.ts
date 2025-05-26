import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const schoolData = await request.json();
    
    // Validate required fields
    if (!schoolData.name || !schoolData.city) {
      return NextResponse.json(
        { error: 'Name and city are required fields' },
        { status: 400 }
      );
    }

    // Create new school
    const result = await db.collection('schools').insertOne(schoolData);
    
    return NextResponse.json(
      { 
        success: true,
        insertedId: result.insertedId,
        message: 'School added successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating school:', error);
    return NextResponse.json(
      { error: 'Failed to create school' },
      { status: 500 }
    );
  }
}
