import type { CreateUserPayload } from '@core/domain/user/entity/type/CreateUserPayload';

export type UpdateUserPayload = Partial<CreateUserPayload>;
