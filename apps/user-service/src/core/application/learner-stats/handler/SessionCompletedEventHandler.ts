import type { EventHandler } from '@core/common/events/EventHandler';
import type { SessionCompletedEvent } from '@core/domain/learner-stats/events/SessionCompletedEvent';

export interface SessionCompletedEventHandler
  extends EventHandler<SessionCompletedEvent, void> {}
