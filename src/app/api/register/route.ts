import User from '@models/User';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

import connectMongo from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, password, email, solanaWallet } = body;

    // Validation
    if (!name || !username || !password || !email) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectMongo();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      solanaWallet: solanaWallet || '',
      role: 'User',
    });

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          solanaWallet: newUser.solanaWallet,
          password: password,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to register user.' },
      { status: 500 }
    );
  }
}
