import { NextRequest, NextResponse } from 'next/server';
import { getSession, createSession } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { deleteFromGCS } from '@/lib/storage';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, bio, customAvatar } = await request.json();

    // Validate bio length
    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: 'Bio must be 500 characters or less' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user
    const user = await User.findOne({ googleId: session.id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If new avatar is set and different from old one, delete old avatar from GCS
    if (
      customAvatar &&
      user.customAvatar &&
      user.customAvatar !== customAvatar &&
      user.customAvatar.includes('storage.googleapis.com')
    ) {
      await deleteFromGCS(user.customAvatar);
    }

    // Update user
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (customAvatar !== undefined) user.customAvatar = customAvatar;

    await user.save();

    // Update session with new data
    await createSession({
      id: user.googleId,
      email: user.email,
      name: user.name,
      picture: user.customAvatar || user.picture,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.googleId,
        email: user.email,
        name: user.name,
        picture: user.customAvatar || user.picture,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ googleId: session.id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      googleId: user.googleId,
      email: user.email,
      name: user.name,
      picture: user.picture,
      customAvatar: user.customAvatar,
      bio: user.bio,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
