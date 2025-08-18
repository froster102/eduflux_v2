import mongoose, { Model } from 'mongoose';
import { ChapterSchema, type IChapter } from '../schema/chapter.schema';

const ChapterModel: Model<IChapter> = mongoose.model('Chapter', ChapterSchema);

export default ChapterModel;
