import { Schema, model } from 'mongoose';

export interface MongooseAsset {
  _id: string;
  provider: string;
  providerSpecificId: string | null;
  resourceType: string | null;
  accessType: string;
  originalFileName: string | null;
  duration: number | null;
  status: string;
  mediaSources: Array<{
    type: string;
    src: string;
  }>;
  additionalMetadata: Record<string, any> | null;
}

const AssetSchema = new Schema<MongooseAsset>(
  {
    _id: {
      type: String,
    },
    provider: { type: String, required: true },
    providerSpecificId: { type: String, default: null },
    resourceType: {
      type: String,
      enum: ['image', 'video', 'raw'],
      default: null,
    },
    accessType: { type: String, enum: ['public', 'private'], required: true },
    originalFileName: { type: String, default: null },
    duration: { type: Number, default: null },
    status: {
      type: String,
      enum: [
        'processing',
        'pending',
        'uploaded',
        'failed',
        'deleted',
        'assigned',
      ],
      default: 'pending',
    },
    mediaSources: [
      {
        type: { type: String, required: true },
        src: { type: String, required: true },
      },
    ],
    additionalMetadata: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
  },
);

export const AssetModel = model<MongooseAsset>('Asset', AssetSchema);
