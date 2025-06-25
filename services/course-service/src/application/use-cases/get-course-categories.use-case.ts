import type { ICategoryRepository } from '@/domain/repositories/category.repository';
import { inject, injectable } from 'inversify';
import { IUseCase } from './interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { Category } from '@/domain/entity/category.entity';

@injectable()
export class GetCourseCategoriesUseCase implements IUseCase<void, Category[]> {
  constructor(
    @inject(TYPES.CategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();
    return categories;
  }
}
