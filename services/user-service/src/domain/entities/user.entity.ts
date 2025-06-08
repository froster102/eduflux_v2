export class User {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  bio?: string;
  socialLinks?: {
    plattform: string;
    url: string;
  }[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    bio?: string,
    socialLinks?: {
      plattform: string;
      url: string;
    }[],
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.bio = bio;
    this.socialLinks = socialLinks;
    this.createdAt = new Date();
    this.updatedAt = new Date(Date.now());
  }
}
