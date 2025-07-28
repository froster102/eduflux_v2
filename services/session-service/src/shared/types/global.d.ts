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
}

export {};
