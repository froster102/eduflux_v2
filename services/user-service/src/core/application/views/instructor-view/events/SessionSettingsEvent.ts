import type { SessionSettingsEvents } from '@core/application/views/instructor-view/events/enum/SessionSettingsEvents';
import type { Event } from '@core/common/events/Event';

export interface SessionSettingsUpdateEvent extends Event {
  readonly type: SessionSettingsEvents.SESSION_SETTINGS_UPDATED;
  readonly instructorId: string;
  readonly price: number;
  readonly currency: string;
  readonly duration: number;
  readonly timeZone: string;
  readonly isSchedulingEnabled: boolean;
}
