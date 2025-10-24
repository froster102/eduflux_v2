export type Course = {
  _class: 'course';
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  level: string;
  categoryId: string;
  price: number;
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
