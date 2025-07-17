import mongoose, { Model } from 'mongoose';
import { IMongoProgress, ProgressSchema } from '../schema/progress.schema';

const ProgressModel: Model<IMongoProgress> = mongoose.model<IMongoProgress>(
  'Progress',
  ProgressSchema,
);

export default ProgressModel;
