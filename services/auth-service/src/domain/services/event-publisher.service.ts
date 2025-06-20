import { IEvent } from '@/shared/interfaces/event.interface';

export interface IEventPublisher {
  publish(topic: string, event: IEvent): Promise<void>;
}
