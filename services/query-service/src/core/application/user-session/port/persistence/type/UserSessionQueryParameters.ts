import type { QueryParameters } from "@core/common/port/persistence/type/QueryParameters";
import type { SessionStatus } from "@core/domain/user-session/enum/SessionStatus";

export interface UserSessionQueryParameters extends QueryParameters {
  status?: SessionStatus;
}
