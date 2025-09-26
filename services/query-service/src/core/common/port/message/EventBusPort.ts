export interface EventBusPort {
  sendEvent<TEvent extends { type: string }>(event: TEvent): Promise<void>;
}
