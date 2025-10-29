import { Role } from '@eduflux-v2/shared/constants/Role';
import { User } from '@domain/user/entity/User';

export class UserUseCaseDto {
  public readonly id: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
  public readonly image?: string;
  public readonly bio: string | undefined;
  public readonly socialLinks: { platform: string; url: string }[] | undefined;
  public readonly roles: Role[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(user: User) {
    this.id = user.id;
    this.firstName = user.getFirstName();
    this.lastName = user.getLastName();
    this.email = user.getEmail();
    this.image = user.getImage();
    this.bio = user.getBio();
    this.socialLinks = user.getSocialLinks();
    this.roles = user.getRoles();
    this.createdAt = user.getCreatedAt();
    this.updatedAt = user.getUpdatedAt();
  }

  public static fromEntity(user: User): UserUseCaseDto {
    return new UserUseCaseDto(user);
  }

  public static fromEntities(user: User[]): UserUseCaseDto[] {
    return user.map((user) => new UserUseCaseDto(user));
  }
}

export type UserDto = UserUseCaseDto;
