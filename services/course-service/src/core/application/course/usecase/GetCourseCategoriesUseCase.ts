import type { Category } from '@core/domain/category/entity/Category';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetCourseCategoriesUseCase extends UseCase<void, Category[]> {}
