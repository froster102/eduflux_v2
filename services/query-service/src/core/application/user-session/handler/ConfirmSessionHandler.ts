import type { EventHandler } from "@core/common/event/EventHandler";
import type { ConfirmSessionEvent } from "@shared/events/ConfirmSessionEvent";

export interface ConfirmSessionEventHandler
  extends EventHandler<ConfirmSessionEvent, void> {}
