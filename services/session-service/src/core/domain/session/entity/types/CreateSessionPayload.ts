import type { NewSessionPayload } from '@core/domain/session/entity/types/NewSessionPayload';

export type CreateSessionPayload = Omit<
  NewSessionPayload,
  'createdAt' | 'updatedAt'
>;
