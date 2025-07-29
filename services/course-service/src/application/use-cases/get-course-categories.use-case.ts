import type { IGetCourseCategoriesUseCase } from './interface/get-course-categories.interface';
import type { ICategoryRepository } from '@/domain/repositories/category.repository';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { Category } from '@/domain/entity/category.entity';

@injectable()
export class GetCourseCategoriesUseCase implements IGetCourseCategoriesUseCase {
  constructor(
    @inject(TYPES.CategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();
    return categories;
  }
}
