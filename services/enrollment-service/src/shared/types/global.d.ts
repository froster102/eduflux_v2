declare global {
  type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    image: string;
    bio: string;
    socialLinks: SocialLinks[];
    createdAt: string;
    updatedAt: string;
  };

  type SocialLinks = {
    platform: string;
    url: string;
  };

  export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

  type Course = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    level: string;
    categoryId: string;
    price: number | null;
    isFree: boolean;
    status: string;
    instructor: { id: string; name: string };
    averageRating: number;
    ratingCount: number;
    enrollmentCount: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };

  export type PaymentPurpose = 'COURSE_ENROLLMENT' | 'INSTRUCTOR_SESSION';

  export type JwtPayload = {
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    roles: string[];
    id: string;
    sessionId: string;
  };
}

export {};
