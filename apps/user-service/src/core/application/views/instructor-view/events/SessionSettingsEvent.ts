import type { SessionSettingsEvents } from '@application/views/instructor-view/events/enum/SessionSettingsEvents';
import type { Event } from '@eduflux-v2/shared/events/Event';

export interface SessionSettingsUpdateEvent extends Event {
  readonly type: SessionSettingsEvents.SESSION_SETTINGS_UPDATED;
  readonly instructorId: string;
  readonly price: number;
  readonly currency: string;
  readonly duration: number;
  readonly timeZone: string;
  readonly isSchedulingEnabled: boolean;
}
