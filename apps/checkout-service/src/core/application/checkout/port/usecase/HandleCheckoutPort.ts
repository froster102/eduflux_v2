export type CheckoutItem = {
  type: 'course' | 'session';
  itemId: string;
};

export interface HandleCheckoutPort {
  userId: string;
  item: CheckoutItem;
}
