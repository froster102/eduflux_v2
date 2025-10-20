import type { EventHandler } from '@core/common/events/EventHandler';
import type { SessionPaymentSuccessfullEvent } from '@core/domain/session/events/SessionPaymentSuccessfullEvent';

export interface SessionPaymentSuccessfullEventHandler
  extends EventHandler<SessionPaymentSuccessfullEvent, void> {}
