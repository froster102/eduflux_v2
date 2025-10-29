import type { SessionConfirmedEvent } from '@eduflux-v2/shared/events/session/SessionConfirmedEvent';
import type { EnrollmentCompletedEvent } from '@eduflux-v2/shared/events/course/EnrollmentCompletedEvent';

export type KafkaEvent = EnrollmentCompletedEvent | SessionConfirmedEvent;
