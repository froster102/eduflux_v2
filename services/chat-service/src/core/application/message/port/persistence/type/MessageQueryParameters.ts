import type { QueryParameters } from "@core/common/port/persistence/type/QueryParameters";

export interface MessageQueryParameters extends QueryParameters {
  before: Date;
}
