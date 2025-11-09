import { EventSubscribers } from '@eduflux-v2/shared/infrastructure/messaging/EventSubscribers';
import { CheckoutDITokens } from '@core/application/checkout/di/CheckoutDITokens';
import type { PaymentSuccessfullEventSubscriber } from '@core/application/checkout/subscriber/PaymentSuccessfullSubscriber';
import type { Container } from 'inversify';

export class CheckoutServiceEventSubscribers extends EventSubscribers {
  static from(container: Container): CheckoutServiceEventSubscribers {
    const paymentSuccessfull = container.get<PaymentSuccessfullEventSubscriber>(
      CheckoutDITokens.PaymentSuccessfullEventSubscriber,
    );
    return new CheckoutServiceEventSubscribers([paymentSuccessfull]);
  }
}
