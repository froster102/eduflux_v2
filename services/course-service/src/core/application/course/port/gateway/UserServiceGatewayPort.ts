export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
}

export interface UserServiceGatewayPort {
  getUser(userId: string): Promise<UserProfile>;
}
