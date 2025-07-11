export interface IUserServiceGateway {
  getUserDetails(userId: string): Promise<UserProfile>;
}
