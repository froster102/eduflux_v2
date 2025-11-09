import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export type CheckoutItem = {
  itemType: 'course' | 'session';
  itemId: string;
};

export interface HandleCheckoutPort {
  item: CheckoutItem;
  executor: AuthenticatedUserDto;
}
