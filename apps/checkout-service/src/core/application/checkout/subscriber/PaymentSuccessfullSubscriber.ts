import type { PaymentSuccessfullEvent } from '@eduflux-v2/shared/events/payment/PaymentSuccessfullEvent';
import type { EventSubscriberPort } from '@eduflux-v2/shared/ports/message/EventSubscriberPort';

export interface PaymentSuccessfullEventSubscriber
  extends EventSubscriberPort<PaymentSuccessfullEvent> {}
