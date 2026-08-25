import { NextResponse } from 'next/server';

const API_URL = process.env.TRACKING_API_URL || 'http://localhost:4000';

export async function GET() {
  const response = await fetch(`${API_URL}/v1/projects`, { cache: 'no-store' });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(`${API_URL}/v1/projects`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
