declare global {
  export type EnrollForCourseResponse = {
    referenceId: string;
    item: {
      title: string;
      image?: string;
      amount: number;
    };
    itemType: "course";
  };
}

export {};
