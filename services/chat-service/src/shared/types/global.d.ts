declare global {
  type Role = "ADMIN" | "INSTRUCTOR" | "LEARNER";

  type ClassType = "chapter" | "lecture" | "asset";

  type User = {
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

  type SocialLinks = {
    platform: string;
    url: string;
  };
}

export {};
