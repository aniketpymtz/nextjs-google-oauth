import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import UserAddressModel from '@/models/UserAddress';

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const address = await UserAddressModel.findOne({ googleId: user.id });

    if (!address) {
      return NextResponse.json({ address: null }, { status: 200 });
    }

    return NextResponse.json({ address }, { status: 200 });
  } catch (error) {
    console.error('Error fetching address:', error);
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {  city, state, pincode, country } = body;

    if (!city || !state || !pincode || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const address = await UserAddressModel.findOneAndUpdate(
      { googleId: user.id },
      {
        googleId: user.id,
        city,
        state,
        pincode,
        country,
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ address }, { status: 200 });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}
