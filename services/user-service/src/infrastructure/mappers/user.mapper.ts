import { User } from '@/domain/entities/user.entity';
import { IMapper } from './mapper.interface';
import { IMongoUser } from '../database/schema/user.schema';

export class UserMapper implements IMapper<User, IMongoUser> {
  toDomain(raw: IMongoUser): User {
    return User.fromPersistence(
      (raw._id as string).toString(),
      raw.firstName,
      raw.lastName,
      raw.email,
      raw.roles,
      raw.createdAt,
      raw.updatedAt,
      raw.imageUrl,
      raw.bio,
      raw.socialLinks,
    );
  }

  toPersistance(raw: User): Partial<IMongoUser> {
    return {
      _id: raw.id,
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      roles: raw.roles,
      imageUrl: raw.imageUrl,
      bio: raw.bio,
      socialLinks: raw.socialLinks,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
