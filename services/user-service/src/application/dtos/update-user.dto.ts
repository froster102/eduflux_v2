export class UpdateUserDto {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  bio?: string;
  socialLinks?: {
    plattform: string;
    url: string;
  }[];
}
