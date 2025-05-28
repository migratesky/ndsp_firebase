import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserAccountModel } from '@/models/UserAccount';

export async function GET() {
  try {
    // Test basic connection
    const { client, db } = await connectToDatabase();
    await db.command({ ping: 1 });
    
    // Test simple count
    const count = await UserAccountModel.countDocuments();
    
    // Test minimal query
    const sampleUser = await UserAccountModel.findOne().select('_id').lean();
    
    return NextResponse.json({
      status: 'success',
      connection: 'ok',
      userCount: count,
      sampleUserId: sampleUser?._id,
      serverInfo: await client.db().admin().serverInfo()
    });
  } catch (error) {
    console.error('MongoDB test error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
