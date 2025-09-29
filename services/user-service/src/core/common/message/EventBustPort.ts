export interface EventBusPort {
  sendEvent<TEvent extends { type: string; correlationId: string }>(
    event: TEvent,
  ): Promise<void>;
}
