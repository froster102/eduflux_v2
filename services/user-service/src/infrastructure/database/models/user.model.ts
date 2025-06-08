import mongoose, { Model, Schema } from 'mongoose';

const SocialLinkSchema = new Schema(
  {
    plattform: {
      type: String,
      required: true,
      enum: ['x', 'facebook', 'instagram', 'linkedin', 'youtube', 'website'],
    },
    url: { type: String, required: true },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    id: {
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

export interface IMongoUser extends Document {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  bio?: string;
  socialLinks?: {
    plattform: string;
    url: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserModel: Model<IMongoUser> = mongoose.model<IMongoUser>(
  'User',
  userSchema,
);

export default UserModel;
