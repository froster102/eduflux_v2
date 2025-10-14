export interface CreateSubscribedCoursePayload {
  id: string;
  userId: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: {
    id: string;
    name: string;
  };
  level: string;
  enrollmentCount: number;
  averageRating: number;
  createdAt?: string;
  updatedAt?: string;
}
