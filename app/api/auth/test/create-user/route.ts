/* eslint-disable @typescript-eslint/no-explicit-any */
import { account } from '@/lib/appwrite-server';
import { ID } from 'appwrite';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a test user
    const user = await account.create(
      ID.unique(),
      'test@example.com',
      'password123',
      'Test User'
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test user created',
      user 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      code: error.code 
    });
  }
}