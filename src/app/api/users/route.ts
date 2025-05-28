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

// Enhanced in-memory cache with longer expiry
const localCache = {
  users: null as any,
  expiry: 0,
  lastFetchTime: 0,
  isFetching: false
};

// Cache timeout values
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
const STALE_WHILE_REVALIDATE_DURATION = 30 * 60 * 1000; // 30 minutes

// GET all users with pagination
export async function GET(request: Request) {
  console.time('users-api-request'); // Performance tracking
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  // Function to fetch fresh data from the database
  const fetchFreshData = async () => {
    // Set isFetching flag to prevent multiple concurrent fetches
    if (localCache.isFetching) {
      console.log('[API /api/users] Another fetch already in progress, waiting...');
      // Wait for the other fetch to complete
      let waitTime = 0;
      while (localCache.isFetching && waitTime < 5000) {
        await new Promise(resolve => setTimeout(resolve, 100));
        waitTime += 100;
      }
      
      // If we now have fresh data, return it
      if (localCache.users && localCache.lastFetchTime > Date.now() - 5000) {
        return localCache.users;
      }
    }
    
    localCache.isFetching = true;
    
    try {
      console.log('[API /api/users] Fetching fresh data from database');
      const { db } = await connectToDatabase();
      
      if (!db) {
        throw new Error('Database connection failed');
      }
      
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
      .lean()
      .maxTimeMS(3000);
      
      const result = { data: users };
      
      // Update cache
      localCache.users = result;
      localCache.expiry = Date.now() + CACHE_DURATION;
      localCache.lastFetchTime = Date.now();
      
      // Update KV cache if available
      if (kvStore) {
        try {
          await kvStore.set('cached-users', JSON.stringify(result), { ex: Math.floor(CACHE_DURATION / 1000) });
        } catch (error) {
          console.warn('[API /api/users] Failed to update KV cache:', error);
        }
      }
      
      return result;
    } catch (error) {
      console.error('[API /api/users] Error fetching fresh data:', error);
      throw error;
    } finally {
      localCache.isFetching = false;
    }
  };
  
  // Implement stale-while-revalidate strategy
  try {
    // 1. Check for fresh cache
    if (localCache.users && localCache.expiry > Date.now()) {
      console.log('[API /api/users] Fresh cache hit');
      console.timeEnd('users-api-request');
      return NextResponse.json(localCache.users, { status: 200 });
    }
    
    // 2. Check for stale cache (still usable but needs revalidation)
    const isStaleButUsable = localCache.users && 
      localCache.expiry <= Date.now() && 
      localCache.expiry > Date.now() - STALE_WHILE_REVALIDATE_DURATION;
    
    if (isStaleButUsable) {
      console.log('[API /api/users] Stale cache hit, revalidating in background');
      
      // Return stale data immediately
      const staleData = localCache.users;
      
      // Revalidate in background without blocking response
      setTimeout(() => {
        fetchFreshData().catch(err => 
          console.error('[API /api/users] Background revalidation failed:', err)
        );
      }, 0);
      
      console.timeEnd('users-api-request');
      return NextResponse.json(staleData, { status: 200 });
    }
    
    // 3. Try KV cache if available
    if (kvStore) {
      try {
        const cachedData = await kvStore.get('cached-users');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData as string);
          console.log('[API /api/users] KV cache hit');
          
          // Update local cache
          localCache.users = parsedData;
          localCache.expiry = Date.now() + CACHE_DURATION;
          
          // Revalidate in background
          setTimeout(() => {
            fetchFreshData().catch(err => 
              console.error('[API /api/users] Background revalidation failed:', err)
            );
          }, 0);
          
          console.timeEnd('users-api-request');
          return NextResponse.json(parsedData, { status: 200 });
        }
      } catch (error) {
        console.warn('[API /api/users] KV cache error:', error);
      }
    }
    
    // 4. No usable cache, fetch fresh data
    const freshData = await fetchFreshData();
    console.timeEnd('users-api-request');
    return NextResponse.json(freshData, { status: 200 });
  } catch (error) {
    console.error('[API /api/users] Request failed:', error);
    console.timeEnd('users-api-request');
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }

  // The old implementation has been replaced by the stale-while-revalidate strategy above
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
