import type { EventHandler } from "@core/common/port/event/EventHandler";
import type { EnrollmentEvent } from "@shared/events/EnrollmentEvent";

export interface EnrollmentEventHandler
  extends EventHandler<EnrollmentEvent, void> {}
