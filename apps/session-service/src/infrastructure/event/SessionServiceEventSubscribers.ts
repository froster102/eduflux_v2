import { EventSubscribers } from '@eduflux-v2/shared/infrastructure/messaging/EventSubscribers';
import { UserSessionDITokens } from '@core/application/views/user-session/di/UserSessionDITokens';
import type { UserSessionUpdatedEventSubscriber } from '@core/application/views/user-session/subscriber/UserSessionUpdatedEventSubscriber';
import type { UserUpdatedEventSubscriber } from '@core/application/views/user-session/subscriber/UserUpdatedEventSubscriber';
import type { Container } from 'inversify';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionBookingConfirmEventSubscriber } from '@core/application/views/user-session/subscriber/SessionBookingConfirmEventSubscriber';

export class SessionServiceEventSubscribers extends EventSubscribers {
  static from(container: Container): SessionServiceEventSubscribers {
    const userSessionUpdated = container.get<UserSessionUpdatedEventSubscriber>(
      UserSessionDITokens.UserSessionUpdatedEventSubscriber,
    );
    const sessionBookingConfirm =
      container.get<SessionBookingConfirmEventSubscriber>(
        SessionDITokens.SessionBookingConfirmEventSubscriber,
      );
    const userUpdated = container.get<UserUpdatedEventSubscriber>(
      UserSessionDITokens.UserUpdatedEventSubscriber,
    );

    return new SessionServiceEventSubscribers([
      userSessionUpdated,
      userUpdated,
      sessionBookingConfirm,
    ]);
  }
}
