import { SessionPrice } from '@/domain/entities/user.entity';
import { Role } from '@/shared/types/role';
import { Schema } from 'mongoose';

export interface IMongoUser extends Document {
  _id: Schema.Types.ObjectId | string;
  firstName: string;
  lastName: string;
  email: string;
  sessionPrice: SessionPrice | null;
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

const SessionPriceSchema = new Schema(
  {
    price: { type: Number },
    currency: { type: String },
    durationMinutes: { type: Number },
  },
  { _id: false },
);

export const UserSchema = new Schema<IMongoUser>(
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
    sessionPrice: SessionPriceSchema,
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
