import type { EnrollmentSuccessEvent } from '@core/domain/learner-stats/events/EnrollmentSuccessEvent';
import type { SessionUpdatedEvent } from '@core/domain/learner-stats/events/SessionUpdatedEvent';

export type KafkaEvent = EnrollmentSuccessEvent | SessionUpdatedEvent;
