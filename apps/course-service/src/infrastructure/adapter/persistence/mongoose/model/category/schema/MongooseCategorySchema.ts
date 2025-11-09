import { Schema, model } from 'mongoose';

export interface MongooseCategory {
  _id: string;
  title: string;
  titleCleaned: string;
}

const CategorySchema = new Schema<MongooseCategory>({
  _id: { type: String },
  title: { type: String, required: true, unique: true },
  titleCleaned: { type: String, required: true },
});

export const CategoryModel = model<MongooseCategory>(
  'Category',
  CategorySchema,
);
