import type { UserUpdatedEvent } from '@core/application/views/user-session/events/UserUpdatedEvent';
import type { SessionCompletedEvent } from '@eduflux-v2/shared/events/session/SessionCompletedEvent';
import type { SessionConfirmedEvent } from '@eduflux-v2/shared/events/session/SessionConfirmedEvent';
import type { SessionPaymentSuccessfullEvent } from '@eduflux-v2/shared/events/session/SessionPaymentSuccessfullEvent';
import type { SessionUpdatedEvent } from '@eduflux-v2/shared/events/session/SessionUpdatedEvent';

export type KafkaEvent =
  | SessionConfirmedEvent
  | SessionUpdatedEvent
  | UserUpdatedEvent
  | SessionCompletedEvent
  | SessionPaymentSuccessfullEvent;
