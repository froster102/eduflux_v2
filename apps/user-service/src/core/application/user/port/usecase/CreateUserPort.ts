import { Role } from '@eduflux-v2/shared/constants/Role';

export interface CreateUserPort {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  bio?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}
