import { CourseLevel } from '@core/domain/course/enum/CourseLevel';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import type { Instructor } from './CreateCoursePayload';

export interface NewCoursePayload {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  level: CourseLevel | null;
  categoryId: string;
  price: number | null;
  isFree: boolean;
  status: CourseStatus;
  slug: string;
  feedback: string | null;
  instructor: Instructor;
  averageRating: number;
  ratingCount: number;
  enrollmentCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}
