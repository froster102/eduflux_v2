import { Schema } from 'mongoose';

export interface ICategory extends Document {
  _id: Schema.Types.ObjectId | string;
  title: string;
  titleCleaned: string;
}

export const CategorySchema = new Schema<ICategory>(
  {
    _id: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    titleCleaned: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
