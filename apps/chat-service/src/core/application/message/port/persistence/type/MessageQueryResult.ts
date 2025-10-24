import type { Message } from "@core/domain/message/entity/Message";

export interface MessageQueryResult {
  messages: Message[];
  totalCount: number;
}
