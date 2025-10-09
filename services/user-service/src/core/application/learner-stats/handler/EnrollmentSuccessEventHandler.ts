import type { EventHandler } from '@core/common/events/EventHandler';
import type { EnrollmentSuccessEvent } from '@core/domain/learner-stats/events/EnrollmentSuccessEvent';

export interface EnrollmentSuccessEventHandler
  extends EventHandler<EnrollmentSuccessEvent, void> {}
