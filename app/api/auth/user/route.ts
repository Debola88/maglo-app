/* eslint-disable @typescript-eslint/no-explicit-any */
import { account } from '@/lib/appwrite-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;
    
    if (sessionCookie) {
      const session = await account.getSession(sessionCookie);
      console.log('Using cookie session:', session.$id);
    }
    
    const user = await account.get();
    return NextResponse.json({ user });
  } catch (error) {
    const response = NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
    response.cookies.delete('session');
    return response;
  }
}