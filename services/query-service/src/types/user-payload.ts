import { Role } from "@/shared/constants/roles";

export interface JwtUserPayload {
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
