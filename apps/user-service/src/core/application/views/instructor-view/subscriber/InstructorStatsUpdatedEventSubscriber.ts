import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import type { InstructorStatsUpdatedEvent } from '@application/views/instructor-view/events/InstructorStatsUpdatedEvent';

export interface InstructorStatsUpdatedEventSubscriber
  extends EventSubscriberPort<InstructorStatsUpdatedEvent> {}

