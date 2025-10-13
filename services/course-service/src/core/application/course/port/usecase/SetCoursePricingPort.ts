import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface SetCoursePricingPort {
  courseId: string;
  price: number;
  isFree: boolean;
  actor: AuthenticatedUserDto;
}
