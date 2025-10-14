export type TaughtCourseViewUpsertPayload = {
  id: string;
  title?: string | null;
  instructorId: string;
  thumbnail?: string | null;
  description?: string | null;
  level?: string | null;
  enrollmentCount?: number;
  averageRating?: number;
};
