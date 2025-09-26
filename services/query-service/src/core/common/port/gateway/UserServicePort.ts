import type { User } from "@core/common/port/gateway/types/User";

export interface UserServicePort {
  getUser(userId: string): Promise<User>;
}
