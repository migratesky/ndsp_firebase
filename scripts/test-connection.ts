import dotenv from 'dotenv';
import path from 'path';
import { connectToDatabase } from '../src/lib/mongodb';
import { MongoClient, Document } from 'mongodb';

// Extend NodeJS.ProcessEnv with our custom environment variables
interface EnvVars extends NodeJS.ProcessEnv {
  MONGODB_URI: string;
  MONGODB_DB: string;
}

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Type guard to check if all required environment variables are present
function hasRequiredVars(env: NodeJS.ProcessEnv): env is EnvVars {
  const requiredVars = ['MONGODB_URI', 'MONGODB_DB'] as const;
  return requiredVars.every(varName => env[varName] !== undefined);
}

// Verify required environment variables
if (!hasRequiredVars(process.env)) {
  const missingVars = ['MONGODB_URI', 'MONGODB_DB']
    .filter(varName => !process.env[varName]);
  
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

const env = process.env as EnvVars;
console.log('🔧 Environment variables loaded');
console.log('🔧 MongoDB URI: ***REDACTED***');
console.log('🔧 MongoDB DB:', env.MONGODB_DB);

interface UserDocument extends Document {
  email: string;
  role: string;
  [key: string]: any;
}

async function testConnection() {
  console.log('🔍 Testing MongoDB connection...');
  let client: MongoClient | null = null;
  
  try {
    const connection = await connectToDatabase();
    if (!connection) {
      throw new Error('Failed to establish database connection');
    }
    
    client = connection.client;
    const db = connection.db;
    
    console.log('✅ Successfully connected to MongoDB');
    
    // Test the connection with a ping
    const pingResult = await db.command({ ping: 1 });
    console.log('📡 Database ping result:', pingResult);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📂 Available collections:');
    collections.forEach((collection, index) => {
      console.log(`  ${index + 1}. ${collection.name}`);
    });
    
    // Check if users collection exists
    const usersCollectionExists = collections.some(c => c.name === 'users');
    
    if (usersCollectionExists) {
      const usersCollection = db.collection<UserDocument>('users');
      const userCount = await usersCollection.countDocuments();
      console.log(`👥 Users collection contains ${userCount} documents`);
      
      // List first few users if any
      if (userCount > 0) {
        const users = await usersCollection.find().limit(3).toArray();
        console.log('👤 Sample users (first 3):');
        users.forEach((user, i) => {
          console.log(`  ${i + 1}. ${user.email} (${user.role || 'no role'})`);
        });
      }
    } else {
      console.log('❌ Users collection does not exist');
    }
    
    await client.close();
    process.exit(0);
    
  } catch (error: unknown) {
    console.error('❌ Error connecting to MongoDB:');
    
    if (error instanceof Error) {
      console.error('  Message:', error.message);
      if (error.stack) {
        console.error('  Stack:', error.stack.split('\n')[1]); // Show just the first line of stack trace
      }
    } else {
      console.error('  Unknown error occurred');
    }
    
    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        console.error('  Error closing MongoDB client:', closeError);
      }
    }
    
    process.exit(1);
  }
}

// Run the test
testConnection().catch(console.error);
