export interface UserServicePort {
  getUserDetails(userId: string): Promise<User>;
}
