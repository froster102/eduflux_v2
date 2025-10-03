import type { InstructorCreatedEvent } from "@core/application/instructor-view/events/InstructorCreatedEvent";
import type { EventHandler } from "@core/common/events/EventHandler";

export interface InstructorCreatedEventHandler
  extends EventHandler<InstructorCreatedEvent, void> {}
