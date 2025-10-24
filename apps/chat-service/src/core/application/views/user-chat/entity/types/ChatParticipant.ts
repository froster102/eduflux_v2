import type { Role } from "@core/common/enum/Role";

export type ChatParticipant = {
  id: string;
  name: string;
  role: Role;
  image?: string;
};
