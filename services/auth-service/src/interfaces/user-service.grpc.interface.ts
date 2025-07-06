export interface IUserGrpcService {
  createUserProfile(data: {
    id: string;
    firstName: string;
    lastName: string;
    roles: Role[];
  }): Promise<void>;
}
