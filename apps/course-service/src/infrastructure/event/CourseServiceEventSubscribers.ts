import { EventSubscribers } from '@eduflux-v2/shared/infrastructure/messaging/EventSubscribers';
import type { Container } from 'inversify';

export class CourseServiceEventSubscribers extends EventSubscribers {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static from(container: Container): CourseServiceEventSubscribers {
    return new CourseServiceEventSubscribers([]);
  }
}
