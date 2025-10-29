import { Entity } from '@eduflux-v2/shared/entities/Entity';
import { Role } from '@eduflux-v2/shared/constants/Role';
import type { UpdateUserPayload } from '@domain/user/entity/types/UpdateUserPayload';
import type { CreateUserPayload } from '@domain/user/entity/types/CreateUserPayload';

export class User extends Entity<string> {
  private firstName: string;
  private lastName: string;
  private email: string;
  private image?: string;
  private roles: Role[];
  private bio?: string;
  private socialLinks?: {
    platform: string;
    url: string;
  }[];
  private readonly createdAt: Date;
  private updatedAt: Date;
  private modifiedFields: Partial<UpdateUserPayload> = {};

  constructor(payload: CreateUserPayload) {
    super(payload.id);
    this.firstName = payload.firstName;
    this.lastName = payload.lastName;
    this.email = payload.email;
    this.roles = payload.roles;
    this.image = payload.image;
    this.bio = payload.bio;
    this.socialLinks = payload.socialLinks;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public getEmail(): string {
    return this.email;
  }

  public getImage(): string | undefined {
    return this.image;
  }

  public getBio(): string | undefined {
    return this.bio;
  }

  public getSocialLinks(): { platform: string; url: string }[] | undefined {
    return this.socialLinks;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getRoles(): Role[] {
    return this.roles;
  }

  public getModifiedFields(): Partial<UpdateUserPayload> {
    return this.modifiedFields;
  }

  public update(payload: UpdateUserPayload): void {
    let updated = false;

    if (payload.firstName && this.firstName !== payload.firstName) {
      this.firstName = payload.firstName;
      this.modifiedFields.firstName = payload.firstName;
      updated = true;
    }

    if (payload.lastName && this.lastName !== payload.lastName) {
      this.lastName = payload.lastName;
      this.modifiedFields.lastName = payload.lastName;
      updated = true;
    }

    if (payload.email && this.email !== payload.email) {
      this.email = payload.email;
      this.modifiedFields.email = payload.email;
      updated = true;
    }

    if (payload.roles && this.roles !== payload.roles) {
      this.roles = payload.roles;
      this.modifiedFields.roles = payload.roles;
      updated = true;
    }

    if (payload.image && this.image !== payload.image) {
      this.image = payload.image;
      this.modifiedFields.image = payload.image;
      updated = true;
    }

    if (payload.bio && this.bio !== payload.bio) {
      this.bio = payload.bio;
      this.modifiedFields.bio = payload.bio;
      updated = true;
    }

    if (payload.socialLinks && this.socialLinks !== payload.socialLinks) {
      this.socialLinks = payload.socialLinks;
      this.modifiedFields.socialLinks = payload.socialLinks;
      updated = true;
    }

    if (updated) {
      this.updatedAt = new Date();
    }
  }

  public static new(payload: CreateUserPayload): User {
    const user: User = new User(payload);
    return user;
  }
}
