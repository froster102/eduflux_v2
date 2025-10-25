declare global {
  export type EnrollForCourseResponse = JsonApiErrorResponse<{
    referenceId: string;
    item: {
      title: string;
      image?: string;
      amount: number;
    };
    itemType: 'course';
  }>;
}

export {};
