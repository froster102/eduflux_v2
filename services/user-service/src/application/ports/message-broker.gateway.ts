export interface IUserEvent {
  type: 'user.update';
  correlationId: string;
  data: {
    id: string;
    name?: string;
    image?: string;
    occuredAt: string;
  };
}

export interface IMessageBrokerGatway {
  publish(topic: string, event: IUserEvent): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
