import { Schema } from 'mongoose';

export interface IMongoUser extends Document {
  _id: Schema.Types.ObjectId | string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  bio?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ['x', 'facebook', 'instagram', 'linkedin', 'youtube', 'website'],
    },
    url: { type: String, required: true },
  },
  { _id: false },
);

export const UserSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    bio: {
      type: String,
    },
    socialLinks: [SocialLinkSchema],
  },
  { timestamps: true },
);
