import { Role } from '@core/common/enums/Role';

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
