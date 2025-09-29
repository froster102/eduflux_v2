import type { SessionSettingsEvents } from '@core/domain/session-settings/events/enum/SessionSettingsEvents';

export interface SessionSettingsUpdateEvent {
  type: SessionSettingsEvents.SESSION_SETTINGS_UPDATED;
  data: {
    instructorId: string;
    price: number;
    currency: string;
    duration: number;
    timeZone: string;
    isSchedulingEnabled: boolean;
  };
}
