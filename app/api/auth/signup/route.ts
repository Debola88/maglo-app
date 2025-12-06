/* eslint-disable @typescript-eslint/no-explicit-any */
import { account } from '@/lib/appwrite-server';
import { ID } from 'appwrite';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullname } = await request.json();

    if (!email || !password || !fullname) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await account.create(ID.unique(), email, password, fullname);

    return NextResponse.json({
      success: true,
      user: {
        id: user.$id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error: any) {
    console.error("Signup error details:", error);

    let errorMessage = "Registration failed";

    if (error.code === 409) {
      errorMessage = "An account with this email already exists";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
