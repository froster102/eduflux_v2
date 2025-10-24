import type { EventHandler } from '@core/common/events/EventHandler';
import type { SessionConfimedEvent } from '@core/domain/session/events/SessionConfirmedEvent';

export interface ConfirmSessionEventHandler
  extends EventHandler<SessionConfimedEvent, void> {}
