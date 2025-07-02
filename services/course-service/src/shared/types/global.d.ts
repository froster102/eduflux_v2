declare global {
  type Role = 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';

  type ClassType = 'chapter' | 'lecture' | 'asset';

  type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    bio: string;
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
