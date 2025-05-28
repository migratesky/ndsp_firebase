// MongoDB performance debugging script
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function debugMongoDB() {
  console.time('Total execution time');
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'interactivemap';
  
  console.log('Connecting to MongoDB...');
  console.time('Connection time');
  const client = new MongoClient(uri, {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 1
  });
  
  try {
    await client.connect();
    console.timeEnd('Connection time');
    
    const db = client.db(dbName);
    
    // Get collection stats
    console.log('\n--- Collection Stats ---');
    const stats = await db.command({ collStats: 'users' });
    console.log(`Collection size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total documents: ${stats.count}`);
    console.log(`Avg document size: ${(stats.avgObjSize / 1024).toFixed(2)} KB`);
    
    // Check indexes
    console.log('\n--- Indexes ---');
    const indexes = await db.collection('users').indexes();
    console.log(JSON.stringify(indexes, null, 2));
    
    // Test query performance with explain
    console.log('\n--- Query Performance Analysis ---');
    console.time('Query execution');
    const explainResult = await db.collection('users').find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .explain('executionStats');
    console.timeEnd('Query execution');
    
    console.log(`Documents examined: ${explainResult.executionStats.totalDocsExamined}`);
    console.log(`Execution time: ${explainResult.executionStats.executionTimeMillis} ms`);
    console.log(`Query plan: ${explainResult.queryPlanner.winningPlan.stage}`);
    
    if (explainResult.executionStats.executionTimeMillis > 1000) {
      console.log('\n⚠️ PERFORMANCE ISSUE DETECTED: Query is taking too long to execute');
      
      if (explainResult.executionStats.totalDocsExamined > explainResult.executionStats.nReturned * 10) {
        console.log('⚠️ ISSUE: Examining too many documents compared to returned results');
        console.log('SOLUTION: Add proper indexes for this query pattern');
      }
      
      if (explainResult.queryPlanner.winningPlan.stage === 'COLLSCAN') {
        console.log('⚠️ ISSUE: Collection scan detected (very inefficient)');
        console.log('SOLUTION: Create an index on the createdAt field');
      }
    }
    
    // Test a more optimized query
    console.log('\n--- Testing Optimized Query ---');
    console.time('Optimized query');
    const optimizedResult = await db.collection('users')
      .find({}, { projection: { _id: 1, name: 1, email: 1, role: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();
    console.timeEnd('Optimized query');
    
    console.log(`Retrieved ${optimizedResult.length} documents`);
    
    // Check for potential network latency issues
    console.log('\n--- Network Latency Test ---');
    console.time('Ping command');
    await db.command({ ping: 1 });
    console.timeEnd('Ping command');
    
  } catch (err) {
    console.error('Error during MongoDB debugging:', err);
  } finally {
    await client.close();
    console.timeEnd('Total execution time');
  }
}

debugMongoDB().catch(console.error);
