import type { InstructorStatsUpdatedEvent } from '@core/application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import type { EventHandler } from '@core/common/events/EventHandler';

export interface InstructorStatsUpdatedEventHandler
  extends EventHandler<InstructorStatsUpdatedEvent, void> {}
