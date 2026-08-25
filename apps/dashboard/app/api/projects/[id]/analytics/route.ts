import { NextResponse } from 'next/server';
const API_URL = process.env.TRACKING_API_URL || 'http://localhost:4000';
export async function GET(request: Request, { params }: { params: Promise<{ id:string }> }) {
  const { id } = await params;
  const query = new URL(request.url).search;
  const response = await fetch(`${API_URL}/v1/projects/${id}/analytics${query}`, { cache:'no-store' });
  const data = await response.json();
  return NextResponse.json(data,{status:response.status});
}
