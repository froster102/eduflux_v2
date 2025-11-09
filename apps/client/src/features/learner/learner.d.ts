declare global {
  export type LearnerStats = {
    id: string;
    completedCourses: number;
    completedSessions: number;
    enrolledCourses: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

export {};
