import type { EventHandler } from "@core/common/port/event/EventHandler";
import type { SessionEvent } from "@shared/events/SessionConfirmedEvent";

export interface SessionEventHandler extends EventHandler<SessionEvent, void> {}
