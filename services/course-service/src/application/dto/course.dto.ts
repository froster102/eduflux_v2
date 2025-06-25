import type { CategoryDto } from './category.dto';

export interface CourseDto {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  level: string;
  category: CategoryDto;
  price: string | null;
  isFree: boolean;
  status: string;
  feedback: string | null;
  instructorId: string;
  instructorName: string;
  averageRating: number;
  ratingCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
