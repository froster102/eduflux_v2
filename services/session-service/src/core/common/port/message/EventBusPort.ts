export interface EventBusPort {
  sendEvent<TEvent extends { type: string; entityId: string }>(
    event: TEvent,
  ): Promise<void>;
}
