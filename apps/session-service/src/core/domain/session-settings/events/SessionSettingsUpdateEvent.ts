import type { Event } from '@eduflux-v2/shared/events/Event';
import type { SessionSettingsEvents } from '@core/domain/session-settings/events/enum/SessionSettingsEvents';

export interface SessionSettingsUpdateEvent extends Event {
  readonly type: SessionSettingsEvents.SESSION_SETTINGS_UPDATED;
  readonly instructorId: string;
  readonly price: number;
  readonly currency: string;
  readonly duration: number;
  readonly timeZone: string;
  readonly isSchedulingEnabled: boolean;
}
