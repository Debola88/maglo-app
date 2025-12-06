/* eslint-disable @typescript-eslint/no-explicit-any */
import { account } from '@/lib/appwrite-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await account.deleteSession('current');
    
    const response = NextResponse.json({ success: true });
    
    // response.cookies.delete('session');
    
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 400 }
    );
  }
}