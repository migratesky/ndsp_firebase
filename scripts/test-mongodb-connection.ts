import { MongoClient } from 'mongodb';
import { connectToDatabase } from '../src/lib/mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

console.log('MongoDB URI:', process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:******@'));

async function testConnection() {
  console.log('Testing MongoDB connection...');
  
  try {
    // Test direct MongoDB connection
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    const client = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    await client.connect();
    console.log('✅ Successfully connected to MongoDB server');
    
    // List databases
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log('Available databases:', dbs.databases.map(db => db.name));
    
    // Test the interactive map database
    const db = client.db('interactivemap');
    const collections = await db.listCollections().toArray();
    console.log('Collections in interactive map database:', collections.map(c => c.name));
    
    // Test users collection
    try {
      const usersCount = await db.collection('users').countDocuments();
      console.log(`✅ Found ${usersCount} users in the database`);
    } catch (err) {
      console.error('❌ Error accessing users collection:', err);
    }
    
    await client.close();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
  
  // Test the API endpoint if server is running
  try {
    console.log('\nTesting /api/users endpoint...');
    const response = await fetch('http://localhost:3000/api/users');
    console.log(`API Response Status: ${response.status}`);
    
    if (!response.ok) {
      const error = await response.text().catch(() => 'No error details');
      console.error(`API Error: ${response.status} - ${error}`);
    } else {
      const data = await response.json();
      console.log('API Response Data:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.warn('\n⚠️  Could not test API endpoint. Is the server running?');
    console.warn('Run `npm run dev` to start the development server.\n');
  }
}

// Run the test
testConnection().catch(console.error);
