import type { InstructorViewEvents } from "@core/domain/instructor-view/enum/InstructorViewEvents";

export interface SessionSettingsEvent {
  type: InstructorViewEvents.SESSION_SETTINGS_UPDATED;
  data: {
    instructorId: string;
    price: number;
    currency: string;
    duration: number;
    timeZone: string;
    isSchedulingEnabled: boolean;
  };
}
