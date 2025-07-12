export interface IUserGrpcService {
  createUserProfile(data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: Role[];
  }): Promise<void>;
  updateUser(
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      roles: Role[];
    }> & { id: string },
  ): Promise<void>;
}
