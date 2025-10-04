import { Role } from '../constants/role';

declare global {
  export type User = {
    id: string;
    firstName: string;
    lastName: string;
    image: string;
    bio: string;
    roles: Role[];
    socialLinks: SocialLinks[];
    createdAt: string;
    updatedAt: string;
  };

  export type PaymentPurpose = 'COURSE_ENROLLMENT' | 'INSTRUCTOR_SESSION';

  export type PaymentProvider = 'STRIPE';

  export type JwtPayload = {
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    roles: string[];
    id: string;
    sessionId: string;
  };
}

export {};
