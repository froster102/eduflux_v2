import type { EventHandler } from "@core/common/events/EventHandler";
import type { SessionConfimedEvent } from "@core/domain/user-session/events/ConfirmSessionEvent";

export interface ConfirmSessionEventHandler
  extends EventHandler<SessionConfimedEvent, void> {}
