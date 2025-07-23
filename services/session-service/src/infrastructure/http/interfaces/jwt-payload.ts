import { Role } from '@/shared/constants/role';

export interface JwtPayload {
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
  id: string;
  sessionId: string;
}
