export interface IUserServiceGateway {
  getUserDetails(userId: string): Promise<User>;
}
