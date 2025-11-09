import { User } from '@domain/user/entity/User';
import type { MongooseUser } from '@infrastructure/adapter/persistence/mongoose/models/user/MongooseUser';

export class UserMapper {
  static toDomain(mongooseUser: MongooseUser): User {
    const domainUser: User = new User({
      id: mongooseUser._id,
      firstName: mongooseUser.firstName,
      lastName: mongooseUser.lastName,
      email: mongooseUser.email,
      roles: mongooseUser.roles,
      image: mongooseUser.image,
      bio: mongooseUser.bio,
      socialLinks: mongooseUser.socialLinks,
    });
    return domainUser;
  }

  static toPersistence(domainUser: User): Partial<MongooseUser> {
    const mongooseUser: Partial<MongooseUser> = {
      _id: domainUser.id,
      firstName: domainUser.getFirstName(),
      lastName: domainUser.getLastName(),
      email: domainUser.getEmail(),
      roles: domainUser.getRoles(),
      image: domainUser.getImage(),
      bio: domainUser.getBio(),
      socialLinks: domainUser.getSocialLinks(),
      createdAt: domainUser.getCreatedAt(),
      updatedAt: domainUser.getUpdatedAt(),
    };
    return mongooseUser;
  }

  static toDomainEntities(raw: MongooseUser[]): User[] {
    return raw.map((r) => this.toDomain(r));
  }
}
