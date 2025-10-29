import type { EventHandler } from '@eduflux-v2/shared/events/handler/EventHandler';
import type { InstructorCreatedEvent } from '@domain/user/events/InstructorCreatedEvent';

export interface InstructorCreatedEventHandler
  extends EventHandler<InstructorCreatedEvent, void> {}
