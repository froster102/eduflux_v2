declare global {
  export type Instructor = {
    user: UserProfile;
    sessionsConducted: number;
    totalCourses: number;
    totalLearners: number;
  };

  export type GetInstructorsResult = {
    instructors: Instructor[];
    pagination: Pagination;
  };

  export type GetInstructorsQueryParameters = {} & QueryParmeters;
}

export {};
