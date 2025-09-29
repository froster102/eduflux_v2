import type { CreateEventPayload } from '@core/common/events/types/CreateEventPayload';

export type UserUpdatedEventPayload = {
  readonly id: string;
  readonly image?: string;
  readonly name: string;
  readonly bio?: string;
} & CreateEventPayload;
