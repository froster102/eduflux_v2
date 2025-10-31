import { EventSubscribers } from '@eduflux-v2/shared/infrastructure/messaging/EventSubscribers';
import { UserSessionDITokens } from '@core/application/views/user-session/di/UserSessionDITokens';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionConfirmedEventSubscriber } from '@core/application/views/user-session/subscriber/SessionConfirmedEventSubscriber';
import type { UserSessionUpdatedEventSubscriber } from '@core/application/views/user-session/subscriber/UserSessionUpdatedEventSubscriber';
import type { UserUpdatedEventSubscriber } from '@core/application/views/user-session/subscriber/UserUpdatedEventSubscriber';
import type { Container } from 'inversify';

export class SessionServiceEventSubscribers extends EventSubscribers {
  static from(container: Container): SessionServiceEventSubscribers {
    const sessionConfirmed = container.get<SessionConfirmedEventSubscriber>(
      UserSessionDITokens.SessionConfirmedEventSubscriber,
    );
    const userSessionUpdated = container.get<UserSessionUpdatedEventSubscriber>(
      UserSessionDITokens.UserSessionUpdatedEventSubscriber,
    );
    const userUpdated = container.get<UserUpdatedEventSubscriber>(
      UserSessionDITokens.UserUpdatedEventSubscriber,
    );

    return new SessionServiceEventSubscribers([
      sessionConfirmed,
      userSessionUpdated,
      userUpdated,
    ]);
  }
}
