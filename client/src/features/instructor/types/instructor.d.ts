declare global {
  export type InstructorProfile = {
    name: string;
    bio: string;
    image: string;
  };

  export type Instructor = {
    id: string;
    profile: InstructorProfile;
    sessionsConducted: number;
    totalCourses: number;
    totalLearners: number;
    isSessionEnabled: boolean;
    pricing: {
      price: number;
      currency: string;
      duration: number;
      timeZone: string;
      isSchedulingEnabled: boolean;
    };
  };

  export type GetInstructorsResult = {
    instructors: Instructor[];
    pagination: Pagination;
  };

  export type GetInstructorsQueryParameters = {} & QueryParmeters;
}

export {};
