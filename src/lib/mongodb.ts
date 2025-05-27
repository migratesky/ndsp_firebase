import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI?.startsWith('mongodb') 
  ? process.env.MONGODB_URI 
  : `mongodb+srv://${process.env.MONGODB_URI}`;

const dbName = process.env.MONGODB_DB || '';

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!dbName) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

let cachedClient: MongoClient;
let cachedDb: any;

export async function connectToDatabase() {
  console.log('Connecting to MongoDB...');
  console.log(`Using URI: ${uri ? '*****' : 'NOT SET'}`);
  console.log(`Database: ${dbName}`);
  
  try {
    if (cachedClient && cachedDb) {
      console.log('Using cached database connection');
      return { client: cachedClient, db: cachedDb };
    }

    console.log('Creating new MongoDB connection');
    const client = await MongoClient.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });
    
    const db = client.db(dbName);
    
    // Test connection
    await db.command({ ping: 1 });
    console.log('Successfully connected to MongoDB');
    
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error: unknown) {
    console.error('MongoDB connection error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
    throw new Error(`Failed to connect to MongoDB: ${errorMessage}`);
  }
}
