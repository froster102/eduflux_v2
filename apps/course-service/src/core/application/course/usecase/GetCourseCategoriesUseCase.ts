import type { Category } from '@core/domain/category/entity/Category';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetCourseCategoriesUseCase extends UseCase<void, Category[]> {}
