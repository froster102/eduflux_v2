export interface IUserServiceGateway {
  getUserDetails(userId: string): Promise<{ id: string; name: string }>;
}
