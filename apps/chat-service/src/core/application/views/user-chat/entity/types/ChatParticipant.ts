import type { Role } from '@eduflux-v2/shared/constants/Role';

export type ChatParticipant = {
  id: string;
  name: string;
  role: Role;
  image?: string;
};
