import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import UserAddressModel from '@/models/UserAddress';

// GET - Fetch all addresses for the user
export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const userAddress = await UserAddressModel.findOne({ googleId: user.id });

    if (!userAddress) {
      return NextResponse.json({ addresses: [] }, { status: 200 });
    }

    return NextResponse.json({ addresses: userAddress.addresses }, { status: 200 });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

// POST - Add a new address
export async function POST(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { label, city, state, pincode, country } = body;

    if (!label || !city || !state || !pincode || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Check if user document exists
    let userAddress = await UserAddressModel.findOne({ googleId: user.id });

    if (!userAddress) {
      // Create new document with the first address
      userAddress = await UserAddressModel.create({
        googleId: user.id,
        addresses: [{
          label,
          city,
          state,
          pincode,
          country,
        }],
      });
    } else {
      // Push to existing document
      userAddress = await UserAddressModel.findOneAndUpdate(
        { googleId: user.id },
        {
          $push: {
            addresses: {
              label,
              city,
              state,
              pincode,
              country,
            },
          },
        },
        { new: true }
      );
    }

    return NextResponse.json({ addresses: userAddress?.addresses }, { status: 200 });
  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
}

// PUT - Update an existing address
export async function PUT(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { addressId, label, city, state, pincode, country } = body;

    if (!addressId || !label || !city || !state || !pincode || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const userAddress = await UserAddressModel.findOneAndUpdate(
      { 
        googleId: user.id,
        'addresses._id': addressId,
      },
      {
        $set: {
          'addresses.$.label': label,
          'addresses.$.city': city,
          'addresses.$.state': state,
          'addresses.$.pincode': pincode,
          'addresses.$.country': country,
        },
      },
      { new: true }
    );

    if (!userAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json({ addresses: userAddress.addresses }, { status: 200 });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

// DELETE - Remove an address
export async function DELETE(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('addressId');

    if (!addressId) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    await connectDB();

    const userAddress = await UserAddressModel.findOneAndUpdate(
      { googleId: user.id },
      {
        $pull: {
          addresses: { _id: addressId },
        },
      },
      { new: true }
    );

    if (!userAddress) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ addresses: userAddress.addresses }, { status: 200 });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
