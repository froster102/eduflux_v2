import {
  AccessType,
  MediaSource,
  MediaStatus,
  ResourceType,
  StorageProvider,
} from '@/domain/entity/asset.entity';
import mongoose, { Schema } from 'mongoose';

export interface IAsset {
  _class: ClassType;
  _id: Schema.Types.ObjectId | string;
  provider: StorageProvider;
  providerSpecificId: string | null;
  resourceType: ResourceType | null;
  accessType: AccessType;
  originalFileName: string | null;
  duration: number | null;
  status: MediaStatus;
  mediaSources: MediaSource[];
  additionalMetadata: Record<string, any> | null;
}

export const AssetSchema = new mongoose.Schema<IAsset>({
  _class: {
    type: String,
    default: 'asset',
  },
  _id: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
  },
  providerSpecificId: {
    type: String,
  },
  resourceType: {
    type: String,
    default: 'raw',
  },
  accessType: {
    type: String,
    required: true,
    default: 'private',
  },
  originalFileName: {
    type: String,
  },
  duration: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
  },
  mediaSources: [],
  additionalMetadata: {},
});
