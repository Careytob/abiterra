// app/api/check/route.ts
// Add this file to your project to test API connectivity

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure this is not cached

export async function GET(request: Request) {
  // Return basic info to verify API routes are working
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    message: 'API routes are working correctly',
  });
}