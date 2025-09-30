export interface EventBusPort {
  sendEvent<
    TEvent extends { type: string; correlationId: string; entityId: string },
  >(
    event: TEvent,
  ): Promise<void>;
}
