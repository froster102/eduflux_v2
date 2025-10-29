import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';
import type { EnrollmentPaymentSuccessfullEvent } from '@eduflux-v2/shared/events/course/EnrollmentPaymentSuccessfullEvent';

export interface EnrollmentPaymentSuccessfullEventHandler
  extends EventHandler<EnrollmentPaymentSuccessfullEvent, void> {}
