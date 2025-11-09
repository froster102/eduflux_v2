declare global {
  export type ApplicationStats = {
    id: string;
    totalLearners: number;
    totalInstructors: number;
    platformEarnings: number;
    totalCourses: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

export {};
