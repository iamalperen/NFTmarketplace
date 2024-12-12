import User from '@models/User';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectMongo from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, solanaWallet } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectMongo();

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { email, solanaWallet },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        email: updatedUser.email,
        solanaWallet: updatedUser.solanaWallet,
      },
    });
  } catch (error: any) {
    console.error('Error updating user info:', error.message);
    return NextResponse.json(
      { error: 'Failed to update user info' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongo();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || session.user.email;
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        image: user.image,
        role: user.role,
        solanaWallet: user.solanaWallet,
      },
    });
  } catch (error: any) {
    console.error('Error fetching user info:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch user info' },
      { status: 500 }
    );
  }
}
