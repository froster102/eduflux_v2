import type { PaymentSuccessfullEventSubscriber } from '@core/application/checkout/subscriber/PaymentSuccessfullSubscriber';
import { inject } from 'inversify';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { EventClass } from '@eduflux-v2/shared/events/Event';
import { PaymentSuccessfullEvent } from '@eduflux-v2/shared/events/payment/PaymentSuccessfullEvent';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';
import { PaymentType } from '@eduflux-v2/shared/constants/PaymentType';
import { CreateEnrollmentEvent } from '@eduflux-v2/shared/events/course/CreateEnrollmentEvent';
import { SessionBookingConfirmEvent } from '@eduflux-v2/shared/events/session/SessionBookingConfirmEvent';

export class PaymentSuccessfullEventSubscriberService
  implements PaymentSuccessfullEventSubscriber
{
  constructor(
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
  ) {}
  subscribedTo(): Array<EventClass> {
    return [PaymentSuccessfullEvent];
  }

  async on(event: PaymentSuccessfullEvent): Promise<void> {
    const { paymentType, paymentId, itemId, itemType } = event.payload;
    if (paymentType === PaymentType.COURSE_PURCHASE) {
      const createEnrollmentEvent = new CreateEnrollmentEvent(paymentId, {
        paymentType,
        paymentId,
        payerId: event.payload.payerId,
        recieverId: event.payload.recieverId,
        itemId,
        itemType,
      });

      await this.messageBroker.publish(createEnrollmentEvent);
    } else if (paymentType === PaymentType.SESSION_BOOKING) {
      const confirmedSessionEvent = new SessionBookingConfirmEvent(paymentId, {
        paymentId,
        instructorId: event.payload.recieverId,
        learnerId: event.payload.payerId,
        sessionId: itemId,
      });

      await this.messageBroker.publish(confirmedSessionEvent);
    }
    return;
  }
}
