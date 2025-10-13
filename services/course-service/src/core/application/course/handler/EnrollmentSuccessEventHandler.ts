import type { EventHandler } from '@core/common/events/EventHandler';
import type { EnrollmentSuccessEvent } from '@core/domain/course/EnrollmentSuccessEvent';

export interface EnrollmentSuccessEventHandler
  extends EventHandler<EnrollmentSuccessEvent, void> {}
