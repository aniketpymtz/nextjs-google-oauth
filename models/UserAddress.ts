import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAddress {
  _id?: string;
  label: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface IUserAddress extends Document {
  googleId: string;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    label: {
      type: String,
      required: true,
      enum: ['Work', 'Home', 'Friend', 'Other'],
      default: 'Home',
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'India',
    },
  },
  {
    _id: true,
  }
);

const UserAddressSchema = new Schema<IUserAddress>(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    addresses: {
      type: [AddressSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in development
const UserAddressModel: Model<IUserAddress> = mongoose.models.UserAddress || mongoose.model<IUserAddress>('UserAddress', UserAddressSchema);

export default UserAddressModel;