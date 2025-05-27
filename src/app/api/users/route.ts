
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserAccountModel } from '@/models/UserAccount';

export const dynamic = 'force-dynamic'; // Ensures dynamic rendering, useful for API routes

// GET all users
export async function GET() {
  try {
    await connectToDatabase();
    const users = await UserAccountModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch users', details: errorMessage }, { status: 500 });
  }
}

// POST a new user
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const userData = await request.json();

    // Basic validation
    if (!userData.username || !userData.email || !userData.roles || userData.roles.length === 0) {
      return NextResponse.json({ error: 'Username, email, and at least one role are required.' }, { status: 400 });
    }

    const newUser = new UserAccountModel(userData);
    const savedUser = await newUser.save();
    
    return NextResponse.json(savedUser, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    if (error.code === 11000) { // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json({ error: `An account with this ${field} already exists.`, field }, { status: 409 });
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to create user', details: errorMessage }, { status: 500 });
  }
}

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', // Adjust in production
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
