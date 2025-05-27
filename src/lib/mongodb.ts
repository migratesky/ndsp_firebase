import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
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
  try {
    if (cachedClient && cachedDb) {
      console.log('Using cached database connection');
      return { client: cachedClient, db: cachedDb };
    }

    console.log('Creating new MongoDB connection');
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    
    // Test connection
    await db.command({ ping: 1 });
    console.log('Successfully connected to MongoDB');

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
