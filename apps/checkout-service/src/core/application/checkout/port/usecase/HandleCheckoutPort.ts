import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export type CheckoutItem = {
  type: 'course' | 'session';
  itemId: string;
};

export interface HandleCheckoutPort {
  userId: string;
  item: CheckoutItem;
  executor: AuthenticatedUserDto;
}
