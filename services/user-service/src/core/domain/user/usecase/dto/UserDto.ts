import { Role } from '@core/common/enums/Role';
import { User } from '@core/domain/user/entity/User';

export class UserDto {
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
    this.id = user.getId();
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

  public static fromEntity(user: User): UserDto {
    return new UserDto(user);
  }

  public static fromEntities(user: User[]): UserDto[] {
    return user.map((user) => new UserDto(user));
  }
}
