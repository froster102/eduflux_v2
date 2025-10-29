import type { Role } from '@shared/constants/Role';

export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  level: string;
  categoryId: string;
  price: number;
  status: string;
  instructor: { id: string; name: string };
  averageRating: number;
  ratingCount: number;
  enrollmentCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  bio: string;
  roles: Role[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
};
