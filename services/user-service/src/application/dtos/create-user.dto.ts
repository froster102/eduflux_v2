export class CreateUserDto {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  socialLinks?: {
    plattform: string;
    url: string;
  }[];
}
