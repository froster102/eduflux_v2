import type { EventSubscriberPort } from '@eduflux-v2/shared/ports/message/EventSubscriberPort';
import type { PaymentSuccessfullEvent } from '@eduflux-v2/shared/events/payment/PaymentSuccessfullEvent';

export interface PaymentSuccessfullEventSubscriber
  extends EventSubscriberPort<PaymentSuccessfullEvent> {}

