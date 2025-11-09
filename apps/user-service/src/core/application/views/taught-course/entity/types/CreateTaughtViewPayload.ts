export interface CreateTaughtCoursePayload {
  id: string;
  instructorId: string;
  title: string;
  thumbnail: string | null;
  level: string | null;
  enrollmentCount: number;
  averageRating: number;
  createdAt?: string;
  updatedAt?: string;
}
