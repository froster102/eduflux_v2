import mongoose, { Model } from 'mongoose';
import { CategorySchema, type ICategory } from '../schema/category.schema';

const Category: Model<ICategory> = mongoose.model<ICategory>(
  'Category',
  CategorySchema,
);

export default Category;
