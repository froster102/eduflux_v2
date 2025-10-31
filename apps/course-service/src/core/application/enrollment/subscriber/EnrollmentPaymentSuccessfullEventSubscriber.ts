import type { EventSubscriberPort } from '@eduflux-v2/shared/src/ports/message/EventSubscriberPort';
import type { EnrollmentPaymentSuccessfullEvent } from '@eduflux-v2/shared/events/course/EnrollmentPaymentSuccessfullEvent';

export interface EnrollmentPaymentSuccessfullEventSubscriber
  extends EventSubscriberPort<EnrollmentPaymentSuccessfullEvent> {}
