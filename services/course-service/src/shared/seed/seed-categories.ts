import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { container } from '@di/RootModule';
import { CategoryModel } from '@infrastructure/adapter/persistence/mongoose/model/category/MongooseCategory';
import { DatabaseConfig } from '@shared/config/DatabaseConfig';
import mongoose from 'mongoose';

const categories = [
  {
    _id: '288',
    title: 'Development',
    titleCleaned: 'development',
  },
  {
    _id: '268',
    title: 'Business',
    titleCleaned: 'business',
  },
  {
    _id: '328',
    title: 'Finance & Accounting',
    titleCleaned: 'finance-and-accounting',
  },
  {
    _id: '294',
    title: 'IT & Software',
    titleCleaned: 'it-and-software',
  },
  {
    _id: '292',
    title: 'Office Productivity',
    titleCleaned: 'office-productivity',
  },
  {
    _id: '296',
    title: 'Personal Development',
    titleCleaned: 'personal-development',
  },
  {
    _id: '269',
    title: 'Design',
    titleCleaned: 'design',
  },
  {
    _id: '290',
    title: 'Marketing',
    titleCleaned: 'marketing',
  },
  {
    _id: '274',
    title: 'Lifestyle',
    titleCleaned: 'lifestyle',
  },
  {
    _id: '273',
    title: 'Photography & Video',
    titleCleaned: 'photography-and-video',
  },
  {
    _id: '276',
    title: 'Health & Fitness',
    titleCleaned: 'health-and-fitness',
  },
  {
    _id: '278',
    title: 'Music',
    titleCleaned: 'music',
  },
  {
    _id: '300',
    title: 'Teaching & Academics',
    titleCleaned: 'teaching-and-academics',
  },
];

async function seedCategories() {
  const logger = container
    .get<LoggerPort>(CoreDITokens.Logger)
    .fromContext(seedCategories.name);
  try {
    await mongoose.connect(DatabaseConfig.MONGO_URI);
    logger.info('Connected to database for seeding');
    await CategoryModel.insertMany(categories);
    logger.info('Categories seeded sucessfully.');
  } catch (error) {
    logger.error(
      `Failed to connect to  database for seeding`,
      error as Record<string, any>,
    );
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

void seedCategories();
