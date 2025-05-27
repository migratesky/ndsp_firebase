import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([], { status: 200 });
}

export async function POST(request: Request) {
  return NextResponse.json({ success: true, id: 'new-content-item' }, { status: 201 });
}
