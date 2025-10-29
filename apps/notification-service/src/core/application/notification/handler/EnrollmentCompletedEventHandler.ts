import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';
import type { EnrollmentCompletedEvent } from '@eduflux-v2/shared/events/course/EnrollmentCompletedEvent';

export interface EnrollmentCompletedEventHandler
  extends EventHandler<EnrollmentCompletedEvent, void> {}
