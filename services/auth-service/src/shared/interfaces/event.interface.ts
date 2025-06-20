export interface IEvent {
  type: string;
  payload: Record<string, any>;
  metadata: {
    serviceId: string;
    timestamp: string;
  };
}
