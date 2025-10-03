import type { InstructorStatsEvent } from "@core/application/instructor-view/events/InstructorStatsEvent";
import type { EventHandler } from "@core/common/events/EventHandler";

export interface InstructorStatsEventHandler
  extends EventHandler<InstructorStatsEvent, void> {}
