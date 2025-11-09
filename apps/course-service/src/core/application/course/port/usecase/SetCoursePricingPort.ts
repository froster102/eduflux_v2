import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface SetCoursePricingPort {
  courseId: string;
  price: number;
  isFree: boolean;
  actor: AuthenticatedUserDto;
}
