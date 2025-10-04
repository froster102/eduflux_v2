import type { EventHandler } from '@core/common/events/EventHandler';
import type { SessionUpdatedEvent } from '@core/domain/learner-stats/events/SessionUpdatedEvent';

export interface SessionUpdatedEventHandler
  extends EventHandler<SessionUpdatedEvent, void> {}
