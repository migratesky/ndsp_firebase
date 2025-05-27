import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

const userSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(100),
  role: z.enum(['admin', 'editor', 'viewer']),
  password: z.string()
    .min(8)
    .max(50)
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character')
    .optional()
});

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function GET() {
  try {
    console.log('Fetching users');
    const { db } = await connectToDatabase();
    const users = await db.collection('users').find().toArray();
    return NextResponse.json(users, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Creating user');
    const { db } = await connectToDatabase();
    const body = await request.json();
    const validatedData = userSchema.parse(body);
    
    if (validatedData.password) {
      validatedData.password = await hashPassword(validatedData.password);
    }
    
    const result = await db.collection('users').insertOne(validatedData);
    return NextResponse.json(
      { success: true, id: result.insertedId },
      { 
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        }
      }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Validation failed' },
      { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        }
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    console.log('Updating user');
    const { db } = await connectToDatabase();
    const { _id, ...body } = await request.json();
    const validatedData = userSchema.parse(body);
    
    if (validatedData.password) {
      validatedData.password = await hashPassword(validatedData.password);
    }
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(_id) },
      { $set: validatedData }
    );
    return NextResponse.json({ success: true }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Update failed' },
      { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        }
      }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    console.log('Deleting user');
    const { db } = await connectToDatabase();
    const { _id } = await request.json();
    
    await db.collection('users').deleteOne({ _id: new ObjectId(_id) });
    return NextResponse.json({ success: true }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Delete failed' },
      { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        }
      }
    );
  }
}
