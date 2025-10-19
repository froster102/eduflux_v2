import type { UserUpdatedEvent } from '@core/application/views/user-session/events/UserUpdatedEvent';
import type { PaymentEvent } from '@core/common/events/PaymentEvent';
import type { SessionCompletedEvent } from '@core/domain/session/events/SessionCompletedEvent';
import type { SessionConfimedEvent } from '@core/domain/session/events/SessionConfirmedEvent';
import type { SessionPaymentSuccessfullEvent } from '@core/domain/session/events/SessionPaymentSuccessfullEvent';
import type { SessionUpdatedEvent } from '@core/domain/session/events/SessionUpdatedEvent';

export type KafkaEvent =
  | SessionConfimedEvent
  | SessionUpdatedEvent
  | UserUpdatedEvent
  | PaymentEvent
  | SessionCompletedEvent
  | SessionPaymentSuccessfullEvent;
