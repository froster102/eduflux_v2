import { Role } from '@/shared/types/role';

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  bio?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}
