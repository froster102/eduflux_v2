import type { CreateEnrollmentEvent } from '@eduflux-v2/shared/events/course/CreateEnrollmentEvent';
import type { EventSubscriberPort } from '@eduflux-v2/shared/ports/message/EventSubscriberPort';

export interface CreateEnrollmentSubscriber
  extends EventSubscriberPort<CreateEnrollmentEvent> {}
