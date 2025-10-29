import { Role } from '@eduflux-v2/shared/constants/Role';

export type CreateUserPayload = {
  id: string;
  firstName: string;
  lastName: string;
  image?: string;
  email: string;
  roles: Role[];
  bio?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
};
