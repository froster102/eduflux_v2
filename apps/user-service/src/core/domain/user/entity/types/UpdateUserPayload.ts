import type { CreateUserPayload } from '@domain/user/entity/types/CreateUserPayload';

export type UpdateUserPayload = Partial<CreateUserPayload>;
