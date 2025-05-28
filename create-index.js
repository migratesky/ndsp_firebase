// Script to create missing index on createdAt field
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function createIndex() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'interactivemap';
  
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected successfully');
    
    const db = client.db(dbName);
    
    // Create index on createdAt field
    console.log('Creating index on createdAt field...');
    const result = await db.collection('users').createIndex(
      { createdAt: -1 },
      { background: true, name: "createdAt_-1" }
    );
    
    console.log(`Index created: ${result}`);
    
  } catch (err) {
    console.error('Error creating index:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

createIndex().catch(console.error);
