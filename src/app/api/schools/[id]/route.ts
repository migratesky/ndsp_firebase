
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// GET a single school by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase();
    const schoolId = params.id;

    if (!ObjectId.isValid(schoolId)) {
      return NextResponse.json({ error: 'Invalid school ID format' }, { status: 400 });
    }

    const school = await db.collection('schools').findOne({ _id: new ObjectId(schoolId) });

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }
    return NextResponse.json(school, { status: 200 });
  } catch (error) {
    console.error('Error fetching school by ID:', error);
    return NextResponse.json({ error: 'Failed to fetch school' }, { status: 500 });
  }
}

// PUT (Update) a school by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase();
    const schoolId = params.id;
    
    if (!ObjectId.isValid(schoolId)) {
      return NextResponse.json({ error: 'Invalid school ID format' }, { status: 400 });
    }

    const schoolData = await request.json();
    // Remove _id from schoolData if present, as it should not be updated
    const { _id, ...updateData } = schoolData;

    // Add/update an 'updatedAt' timestamp
    updateData.updatedAt = new Date();

    const result = await db.collection('schools').updateOne(
      { _id: new ObjectId(schoolId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }
    if (result.modifiedCount === 0 && result.matchedCount === 1) {
       // No fields were actually changed, but it's not an error
      const updatedSchool = await db.collection('schools').findOne({ _id: new ObjectId(schoolId) });
      return NextResponse.json(updatedSchool, { status: 200 });
    }

    const updatedSchool = await db.collection('schools').findOne({ _id: new ObjectId(schoolId) });
    return NextResponse.json(updatedSchool, { status: 200 });
  } catch (error) {
    console.error('Error updating school:', error);
    // Handle potential duplicate key errors if unique fields are involved
    if (error instanceof Error && (error as any).code === 11000) {
        return NextResponse.json({ error: 'Update failed due to duplicate value for a unique field.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update school' }, { status: 500 });
  }
}

// DELETE a school by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase();
    const schoolId = params.id;

    if (!ObjectId.isValid(schoolId)) {
      return NextResponse.json({ error: 'Invalid school ID format' }, { status: 400 });
    }

    const result = await db.collection('schools').deleteOne({ _id: new ObjectId(schoolId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'School deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting school:', error);
    return NextResponse.json({ error: 'Failed to delete school' }, { status: 500 });
  }
}

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
