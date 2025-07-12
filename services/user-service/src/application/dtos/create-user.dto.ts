import { Role } from '@/shared/types/role';

export class CreateUserDto {
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
