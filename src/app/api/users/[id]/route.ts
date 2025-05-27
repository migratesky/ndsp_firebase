
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserAccountModel } from '@/models/UserAccount';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// GET a single user by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const userId = params.id;

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    const user = await UserAccountModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch user', details: errorMessage }, { status: 500 });
  }
}

// PUT (Update) a user by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const userId = params.id;
    
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    const userData = await request.json();
    // Remove _id from userData if present, as it should not be updated directly this way
    const { _id, createdAt, updatedAt, ...updateData } = userData;

    // Basic validation
    if (updateData.roles && (!Array.isArray(updateData.roles) || updateData.roles.length === 0)) {
        return NextResponse.json({ error: 'At least one role must be assigned.' }, { status: 400 });
    }


    const updatedUser = await UserAccountModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true } // new: true returns the updated document, runValidators ensures schema validation
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found or no changes made' }, { status: 404 });
    }
    
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error('Error updating user:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    if (error.code === 11000) { // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json({ error: `An account with this ${field} already exists.`, field }, { status: 409 });
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to update user', details: errorMessage }, { status: 500 });
  }
}

// DELETE a user by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const userId = params.id;

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    const result = await UserAccountModel.findByIdAndDelete(userId);

    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 }); // Or 204 No Content
  } catch (error) {
    console.error('Error deleting user:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to delete user', details: errorMessage }, { status: 500 });
  }
}

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', // Adjust in production
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
