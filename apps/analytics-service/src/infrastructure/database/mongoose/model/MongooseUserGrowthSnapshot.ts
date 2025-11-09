import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface MongooseUserGrowthSnapshot extends Document {
  date: Date;
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserGrowthSnapshotSchema = new Schema<MongooseUserGrowthSnapshot>(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
      index: true,
    },
    userCount: {
      type: Number,
      required: true,
      default: 0,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const UserGrowthSnapshotModel: Model<MongooseUserGrowthSnapshot> =
  mongoose.model<MongooseUserGrowthSnapshot>(
    'UserGrowthSnapshot',
    UserGrowthSnapshotSchema,
  );
