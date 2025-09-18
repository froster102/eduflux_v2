declare global {
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
}

export {};
