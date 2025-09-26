import type { Role } from "@core/common/enums/Role";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  bio: string;
  roles: Role[];
  socialLinks: SocialLinks[];
  createdAt: string;
  updatedAt: string;
};

export type SocialLinks = {
  platform: string;
  url: string;
};
