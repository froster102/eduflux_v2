import { Role } from '@core/common/enums/Role';

export interface AuthenticatedUserDto {
  id: string;
  roles: Role[];
  hasRole(role: Role): boolean;
}
