import type { EventHandler } from '@core/common/events/EventHandler';
import type { EnrollmentCompletedEvent } from '@core/domain/learner-stats/events/EnrollmentCompletedEvent';

export interface EnrollmentCompletedEventHandler
  extends EventHandler<EnrollmentCompletedEvent, void> {}
