import type { Role } from '@shared/constants/Role';

export type JwtPayload = {
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
  id: string;
  sessionId: string;
};
