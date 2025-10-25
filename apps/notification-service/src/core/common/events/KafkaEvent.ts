import type { EnrollmentSuccessEvent } from '@shared/events/EnrollmentEvent';
import type { SessionConfimedEvent } from '@shared/events/SessionConfirmedEvent';

export type KafkaEvent = EnrollmentSuccessEvent | SessionConfimedEvent;
