import { Role } from '@eduflux-v2/shared/constants/Role';

export interface UpdateUserPort {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: Role[];
  image?: string;
  bio?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}
