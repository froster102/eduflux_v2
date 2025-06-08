export interface JwtPayload {
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  id: string;
  sessionId: string;
}
