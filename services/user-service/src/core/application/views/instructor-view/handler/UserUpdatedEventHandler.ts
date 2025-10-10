import type { EventHandler } from '@core/common/events/EventHandler';
import type { UserUpdatedEvent } from '@core/domain/user/events/UserUpdatedEvent';

export interface UserUpdatedEventHandler
  extends EventHandler<UserUpdatedEvent, void> {}
