export type CreateProgressPayload = {
  id: string;
  userId: string;
  courseId: string;
  completedLectures: Set<string>;
};
