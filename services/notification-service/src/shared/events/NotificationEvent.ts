import type { EnrollmentEvent } from "@shared/events/EnrollmentEvent";
import type { SessionEvent } from "@shared/events/SessionConfirmedEvent";

export type NotificationEvent = (EnrollmentEvent | SessionEvent) & {
  type: string;
};
