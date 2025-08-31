export interface UserServicePort {
  getUser(userId: string): Promise<UserProfile>;
}
