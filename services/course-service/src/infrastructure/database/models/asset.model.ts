import mongoose, { Model } from 'mongoose';
import { IAsset, AssetSchema } from '../schema/asset.schema';

const Asset: Model<IAsset> = mongoose.model('Asset', AssetSchema);

export default Asset;
