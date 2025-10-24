import type { EventHandler } from "@core/common/port/event/EventHandler";
import type { EnrollmentSuccessEvent } from "@shared/events/EnrollmentEvent";

export interface EnrollmentSuccessEventHandler
  extends EventHandler<EnrollmentSuccessEvent, void> {}
