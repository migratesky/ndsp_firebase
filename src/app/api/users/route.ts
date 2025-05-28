import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserAccountModel } from '@/models/UserAccount';
import mongoose from 'mongoose';

// Optional import for KV - will be used if available
let kvStore: any = null;
try {
  const { kv } = require('@vercel/kv');
  kvStore = kv;
  console.log('[API] Vercel KV initialized successfully');
} catch (error) {
  console.warn('[API] Vercel KV not available, using local cache only:', error);
}

export const dynamic = 'force-dynamic'; // Ensures dynamic rendering, useful for API routes

// GET all users with pagination
export async function GET(request: Request) {
  console.time('users-api-request'); // Performance tracking
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  try {
    console.log('[API /api/users] Fetching fresh data from database');
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Ensure Mongoose connection is established
    if (mongoose.connection.readyState !== 1) {
      console.log('[API /api/users] Waiting for MongoDB connection...');
      await mongoose.connect(process.env.MONGODB_URI as string);
    }
    
    const skip = (page - 1) * limit;
    
    // Use the new index on createdAt for efficient sorting
    console.log('[API /api/users] Executing query with index on createdAt');
    const users = await UserAccountModel.find({}, { 
      _id: 1, 
      name: 1, 
      email: 1, 
      role: 1, 
      createdAt: 1 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
    
    const result = { data: users };
    
    console.log('[API /api/users] Successfully fetched users:', { count: result.data.length });
    
    console.timeEnd('users-api-request');
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('[API /api/users] Error fetching users:', error);
    console.timeEnd('users-api-request');
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// User data interface
interface UserData {
  username: string;
  email: string;
  roles: string[];
  [key: string]: any; // For any additional fields
}

// POST a new user
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    console.log('[API /api/users] Successfully connected to database for POST.');
    const userData = await request.json() as UserData;

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
