import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';
import type { SessionConfirmedEvent } from '@eduflux-v2/shared/events/session/SessionConfirmedEvent';

export interface ConfirmSessionEventHandler
  extends EventHandler<SessionConfirmedEvent, void> {}
