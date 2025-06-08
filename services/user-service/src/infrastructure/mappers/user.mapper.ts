import { User } from '@/domain/entities/user.entity';
import { IMapper } from './mapper.interface';
import { IMongoUser } from '../database/models/user.model';

export class UserMapper implements IMapper<User, IMongoUser> {
  toDomain(raw: IMongoUser): User {
    return {
      id: raw.id,
      firstName: raw.firstName,
      lastName: raw.lastName,
      imageUrl: raw.imageUrl,
      bio: raw.bio,
      socialLinks: raw.socialLinks,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
  toPersistance(raw: User): Partial<IMongoUser> {
    return {
      id: raw.id,
      firstName: raw.firstName,
      lastName: raw.lastName,
      imageUrl: raw.imageUrl,
      bio: raw.bio,
      socialLinks: raw.socialLinks,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
