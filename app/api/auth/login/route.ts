/* eslint-disable @typescript-eslint/no-explicit-any */
import { account } from '@/lib/appwrite.config';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('Login API called');
  
  try {
    const { email, password, rememberMe = false } = await request.json();
    
    console.log('Login attempt:', { email, rememberMe });
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const session = await account.createEmailPasswordSession(email, password);
    
    const user = await account.get();
    
    console.log('Login successful for user:', user.email);
    
    const response = NextResponse.json({ 
      success: true, 
      user: {
        id: user.$id,
        email: user.email,
        name: user.name
      },
      sessionId: session.$id 
    });
    
    if (rememberMe) {
      response.cookies.set('session', session.$id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }
    
    return response;
    
  } catch (error: any) {
    console.error('Login API error details:', error);
    
    let errorMessage = "Login failed";
    let statusCode = 400;
    
    if (error.code === 401) {
      errorMessage = "Invalid email or password";
      statusCode = 401;
    } else if (error.code === 404) {
      errorMessage = "User not found. Please sign up first";
      statusCode = 404;
    } else if (error.message?.includes('email')) {
      errorMessage = "Invalid email format";
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}