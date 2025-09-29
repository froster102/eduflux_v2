import type { InstructorCreatedEvent } from "@core/application/instructor-view/events/InstructorCreatedEvent";
import type { EventHandler } from "@core/common/event/EventHandler";

export interface InstructorCreatedEventHandler
  extends EventHandler<InstructorCreatedEvent, void> {}
