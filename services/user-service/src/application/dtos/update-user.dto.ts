import { Role } from '@/shared/types/role';

export class UpdateUserDto {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: Role[];
  imageUrl?: string;
  bio?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}
