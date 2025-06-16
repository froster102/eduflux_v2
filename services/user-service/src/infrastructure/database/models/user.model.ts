import mongoose, { Model } from 'mongoose';
import { IMongoUser, UserSchema } from '../schema/user.schema';

const UserModel: Model<IMongoUser> = mongoose.model<IMongoUser>(
  'User',
  UserSchema,
);

export default UserModel;
