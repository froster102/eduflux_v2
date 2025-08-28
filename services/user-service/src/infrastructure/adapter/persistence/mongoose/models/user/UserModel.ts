import { Role } from '@core/common/enums/Role';
import mongoose, { Model } from 'mongoose';

import { Schema } from 'mongoose';

export interface IMongooseUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  image?: string;
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

const UserSchema = new Schema<IMongooseUser>(
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
    email: { type: String },
    image: {
      type: String,
    },
    bio: {
      type: String,
    },
    roles: [],
    socialLinks: [SocialLinkSchema],
  },
  { timestamps: true },
);

export const MongooseUser: Model<IMongooseUser> = mongoose.model<IMongooseUser>(
  'User',
  UserSchema,
);
