import mongoose, { Model } from 'mongoose';
import { type ILecture, LectureSchema } from '../schema/lecture.schema';

const LectureModel: Model<ILecture> = mongoose.model<ILecture>(
  'Lecture',
  LectureSchema,
);

export default LectureModel;
