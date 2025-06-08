export class CreateUserDto {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}
