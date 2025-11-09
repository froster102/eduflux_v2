export type SubscribedCourseViewUpsertPayload = {
  id: string;
  title?: string | null;
  thumbnail?: string | null;
  description?: string | null;
  level?: string | null;
  enrollmentCount?: number;
  averageRating?: number;
};
