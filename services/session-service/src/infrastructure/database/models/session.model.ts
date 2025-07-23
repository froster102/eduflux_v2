import mongoose, { Model } from 'mongoose';
import { IMongoSession, SessionSchema } from '../schema/session.schema';

const SessionModel: Model<IMongoSession> = mongoose.model<IMongoSession>(
  'Session',
  SessionSchema,
);

export default SessionModel;
