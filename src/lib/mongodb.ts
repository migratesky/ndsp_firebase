import { MongoClient, Db, MongoClientOptions } from 'mongodb';
import mongoose from 'mongoose';
import { writeFileSync, appendFileSync } from 'fs';

// Debug logging utility
const debug = (message: string, data: Record<string, any> = {}) => {
  try {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [MongoDB] ${message}`;
    console.log(logMessage, Object.keys(data).length ? data : '');
    
    // Also write to a debug log file
    appendFileSync('mongo-debug.log', `${logMessage} ${JSON.stringify(data)}\n`);
  } catch (error) {
    console.error('Error in debug logger:', error);
  }
};

// Initialize debug log file
try {
  writeFileSync('mongo-debug.log', '');
  debug('Initialized MongoDB debug logging');
} catch (error) {
  console.error('Failed to initialize debug log file:', error);
}

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || '';

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!dbName) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

// Set global timeouts with more optimized values
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 0);
mongoose.set('maxTimeMS', 5000); // Reduced from 30000

let cachedClient: MongoClient | undefined;
let cachedDb: Db | undefined;

export async function connectToDatabase() {
  debug('connectToDatabase called');
  
  // Check if we have a cached connection
  if (cachedClient && cachedDb) {
    try {
      debug('Using cached connection, checking if still alive...');
      await cachedDb.command({ ping: 1 });
      debug('Cached connection is still alive');
      return { client: cachedClient, db: cachedDb };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      debug('Cached connection failed, will create a new one', { error: errorMessage });
      cachedClient = undefined;
      cachedDb = undefined;
    }
  } else {
    debug('No cached connection available, creating a new one');
  }

  const isSRV = uri.includes('mongodb+srv://');
  const connectionOptions: MongoClientOptions = {
    connectTimeoutMS: 10000, // Reduced from 30000
    socketTimeoutMS: 10000,  // Reduced from 45000
    serverSelectionTimeoutMS: 10000, // Reduced from 30000
    maxPoolSize: 10,         // Reduced from 50
    minPoolSize: 1,          // Reduced from 10
    waitQueueTimeoutMS: 10000, // Reduced from 30000
    heartbeatFrequencyMS: 5000, // Reduced from 10000
    ...(!isSRV && { directConnection: true })
  };

  debug('Connecting to MongoDB with options', {
    isSRV,
    uri: uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://$2:******@'),
    dbName: process.env.MONGODB_DB,
    connectionOptions
  });

  let client: MongoClient | null = null;
  const connectStart = Date.now();
  
  try {
    debug('Attempting to connect to MongoDB...');
    client = await MongoClient.connect(uri, connectionOptions);
    const duration = Date.now() - connectStart;
    debug('Successfully connected to MongoDB', { duration });

    if (!client) {
      throw new Error('Failed to create MongoDB client');
    }

    const dbName = process.env.MONGODB_DB || 'interactivemap';
    debug('Getting database instance', { dbName });
    const db = client.db(dbName);
    
    // Test the connection
    debug('Testing database connection with ping command');
    const pingStart = Date.now();
    await db.command({ ping: 1 });
    debug('Database ping successful', { pingDuration: Date.now() - pingStart });
    
    // Cache the connection
    cachedClient = client;
    cachedDb = db;
    
    // Log available collections
    const collections = await db.listCollections().toArray();
    debug('Available collections:', { collections: collections.map(c => c.name) });
    
    debug('MongoDB connection established and cached', {
      uriType: isSRV ? 'SRV' : 'Standard',
      dbName,
      connectionTime: Date.now() - connectStart,
      collectionCount: collections.length
    });
    
    return { client, db };
    
  } catch (error: unknown) {
    const errorInfo = error instanceof Error 
      ? { 
          message: error.message, 
          name: error.name,
          stack: error.stack,
          code: (error as any).code
        }
      : { error: 'Unknown error occurred' };
    
    debug('Failed to connect to MongoDB', errorInfo);
    
    // Clean up if client was partially initialized
    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        debug('Error closing MongoDB client', { error: closeError });
      }
    }
    
    throw error;
  }
  }
