import type { Role } from '@shared/common/enums/Role';

export interface AuthenticatedUserDto {
  id: string;
  roles: Role[];
  hasRole(role: Role): boolean;
}
