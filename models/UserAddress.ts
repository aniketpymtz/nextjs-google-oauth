import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUserAddress extends Document {
  googleId: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserAddressSchema = new Schema<IUserAddress>(
  {
    googleId: {
      type: String,
      required: true,
      index: true,
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
    timestamps: true,
  }
);

// Prevent model overwrite error in development
const UserAddressModel: Model<IUserAddress> = mongoose.models.UserAddress || mongoose.model<IUserAddress>('UserAddress', UserAddressSchema);

export default UserAddressModel;