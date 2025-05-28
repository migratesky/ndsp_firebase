import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config({ path: '.env' });

// User interface
export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

// Default admin user
const DEFAULT_ADMIN: Omit<User, '_id'> = {
  email: 'admin@example.com',
  password: 'admin123', // Will be hashed
  name: 'Admin User',
  role: 'admin',
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function setupUsersCollection() {
  console.log('🚀 Setting up users collection...');
  
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('interactivemap');
    
    // Check if users collection exists
    const collections = await db.listCollections({ name: 'users' }).toArray();
    const usersCollectionExists = collections.length > 0;
    
    if (usersCollectionExists) {
      console.log('ℹ️  Users collection already exists');
      
      // Check if admin user exists
      const adminUser = await db.collection('users').findOne({ email: DEFAULT_ADMIN.email });
      if (adminUser) {
        console.log('✅ Admin user already exists');
        return;
      }
    } else {
      // Create users collection
      await db.createCollection('users');
      console.log('✅ Created users collection');
      
      // Create indexes
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('users').createIndex({ role: 1 });
      await db.collection('users').createIndex({ status: 1 });
      console.log('✅ Created indexes on users collection');
    }
    
    // Hash the default admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, salt);
    
    // Insert default admin user
    await db.collection('users').insertOne({
      ...DEFAULT_ADMIN,
      password: hashedPassword,
    });
    
    console.log('✅ Added default admin user');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the default admin password after first login!');
    
  } catch (error) {
    console.error('❌ Error setting up users collection:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run the setup
setupUsersCollection().catch(console.error);
