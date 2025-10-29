import type { InstructorStatsUpdatedEvent } from '@application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';

export interface InstructorStatsUpdatedEventHandler
  extends EventHandler<InstructorStatsUpdatedEvent, void> {}
