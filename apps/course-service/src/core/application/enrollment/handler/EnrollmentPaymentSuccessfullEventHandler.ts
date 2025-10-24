import type { EventHandler } from '@core/common/events/EventHandler';
import type { EnrollmentPaymentSuccessfullEvent } from '@core/domain/enrollment/events/EnrollmentPaymentSuccessfullEvent';

export interface EnrollmentPaymentSuccessfullEventHandler
  extends EventHandler<EnrollmentPaymentSuccessfullEvent, void> {}
