import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CategoryRepositoryPort } from '@core/application/course/port/persistence/CategoryRepositoryPort';
import type { GetCourseCategoriesUseCase } from '@core/application/course/usecase/GetCourseCategoriesUseCase';
import type { Category } from '@core/domain/category/entity/Category';
import { inject } from 'inversify';

export class GetCourseCategoriesService implements GetCourseCategoriesUseCase {
  constructor(
    @inject(CourseDITokens.CategoryRepository)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async execute(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAll();
    return categories;
  }
}
