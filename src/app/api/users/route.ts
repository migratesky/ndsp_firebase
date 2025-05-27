
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserAccountModel } from '@/models/UserAccount';

export const dynamic = 'force-dynamic'; // Ensures dynamic rendering, useful for API routes

// GET all users
export async function GET() {
  try {
    await connectToDatabase();
    console.log('[API /api/users] Successfully connected to database for GET.');
    const users = await UserAccountModel.find({}).sort({ createdAt: -1 });
    console.log(`[API /api/users] Successfully fetched ${users.length} users.`);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users in /api/users:', error); // More detailed logging
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack available';
    return NextResponse.json({ 
      error: 'Failed to fetch users', 
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined // Only show stack in dev
    }, { status: 500 });
  }
}

// POST a new user
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    console.log('[API /api/users] Successfully connected to database for POST.');
    const userData = await request.json();

    // Basic validation
    if (!userData.username || !userData.email || !userData.roles || userData.roles.length === 0) {
      console.warn('[API /api/users] Validation failed for POST:', userData);
      return NextResponse.json({ error: 'Username, email, and at least one role are required.' }, { status: 400 });
    }

    const newUser = new UserAccountModel(userData);
    const savedUser = await newUser.save();
    console.log('[API /api/users] Successfully created new user:', savedUser._id);
    
    return NextResponse.json(savedUser, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user in /api/users:', error); // More detailed logging
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    if (error.code === 11000) { // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json({ error: `An account with this ${field} already exists.`, field }, { status: 409 });
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack available';
    return NextResponse.json({ 
      error: 'Failed to create user', 
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined 
    }, { status: 500 });
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
