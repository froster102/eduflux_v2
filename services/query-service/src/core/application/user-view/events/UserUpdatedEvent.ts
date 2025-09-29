import type { UserViewEvents } from "@core/application/user-view/events/enum/UserViewEvents";

export interface UserUpdatedEvent {
  readonly type: UserViewEvents.USER_UPDATED;
  readonly id: string;
  readonly image?: string;
  readonly name: string;
  readonly bio?: string;
  readonly occuredAt: string;
}
