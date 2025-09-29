export type NewInstructorPayload = {
  id: string;
  sessionsConducted: number;
  totalCourses: number;
  totalLearners: number;
  isSessionEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};
