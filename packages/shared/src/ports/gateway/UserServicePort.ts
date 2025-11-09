import type {
  CreateUserRequest,
  UserResponse as User,
} from '@shared/adapters/grpc/generated/user';

export interface UserServicePort {
  getUser(userId: string): Promise<User>;
  createUser(request: CreateUserRequest): Promise<User>;
}
