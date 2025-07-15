export interface IEnrollmentEvent {
  type: 'enrollment.success';
  correlationId: string;
  data: {
    enrollmentId: string;
    userId: string | null;
    courseId: string;
    occuredAt: string;
  };
}

export interface IMessageBrokerGatway {
  publish(topic: string, event: IEnrollmentEvent): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
