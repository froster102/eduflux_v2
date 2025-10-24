import type { EventHandler } from '@core/common/events/EventHandler';
import type { InstructorCreatedEvent } from '@core/domain/user/events/InstructorCreatedEvent';

export interface InstructorCreatedEventHandler
  extends EventHandler<InstructorCreatedEvent, void> {}
