import type { EventHandler } from '@core/common/port/event/EventHandler';
import type { SessionConfimedEvent } from '@shared/events/SessionConfirmedEvent';

export interface SessionConfirmedEventHandler
  extends EventHandler<SessionConfimedEvent, void> {}
