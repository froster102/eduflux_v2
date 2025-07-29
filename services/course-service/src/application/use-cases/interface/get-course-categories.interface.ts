import { Category } from '@/domain/entity/category.entity';
import { IUseCase } from './use-case.interface';

export interface IGetCourseCategoriesUseCase
  extends IUseCase<void, Category[]> {}
