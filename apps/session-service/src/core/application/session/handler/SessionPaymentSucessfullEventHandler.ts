import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';
import type { SessionPaymentSuccessfullEvent } from '@eduflux-v2/shared/events/session/SessionPaymentSuccessfullEvent';

export interface SessionPaymentSuccessfullEventHandler
  extends EventHandler<SessionPaymentSuccessfullEvent, void> {}
