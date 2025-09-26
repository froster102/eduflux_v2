import type { Role } from "@core/common/enums/Role";

export type ChatParticipant = {
  id: string;
  name: string;
  role: Role;
  image?: string;
};
