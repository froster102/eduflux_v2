export interface EventBusPort {
  sendEvent<TEvent extends { type: string; id: string }>(
    event: TEvent,
  ): Promise<void>;
}
