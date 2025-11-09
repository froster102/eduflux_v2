import { Event } from '@shared/events/Event';
import { SessionSettingsEvents } from '@shared/events/session/enum/SessionSettingsEvents';

export interface SessionSettingsUpdateEventPayload {
  readonly instructorId: string;
  readonly price: number;
  readonly currency: string;
  readonly duration: number;
  readonly timeZone: string;
  readonly isSchedulingEnabled: boolean;
}

export class SessionSettingsUpdateEvent extends Event<SessionSettingsUpdateEventPayload> {
  static readonly EVENT_NAME: string = SessionSettingsEvents.SESSION_SETTINGS_UPDATED;

  constructor(id: string, payload: SessionSettingsUpdateEventPayload) {
    super({ id, name: SessionSettingsEvents.SESSION_SETTINGS_UPDATED }, payload);
  }
}
