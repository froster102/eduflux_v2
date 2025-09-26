import type { Role } from "@core/common/enums/Role";

export class AuthenticatedUserDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly roles: Role[],
  ) {}

  hasRole(role: Role): boolean {
    if (!this.roles || !Array.isArray(this.roles)) {
      return false;
    }

    return this.roles.includes(role);
  }

  hasAnyRole(roles: Role[]): boolean {
    if (
      !this.roles ||
      !roles ||
      !Array.isArray(this.roles) ||
      !Array.isArray(roles)
    ) {
      return false;
    }

    return this.roles.some((r) => this.roles.includes(r));
  }

  hasAllRoles(roles: Role[]): boolean {
    if (
      !this.roles ||
      !roles ||
      !Array.isArray(this.roles) ||
      !Array.isArray(roles)
    ) {
      return false;
    }

    return this.roles.every((r) => this.roles.includes(r));
  }
}
