import type { Role } from "@core/common/enum/Role";
import type { QueryParameters } from "@core/common/port/persistence/type/QueryParameters";

export interface GetChatsPort {
  userId: string;
  role: Role;
  queryParameters?: QueryParameters;
}
