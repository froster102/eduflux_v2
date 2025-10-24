export type CreateEnrollmentUseCaseResult = {
  referenceId: string;
  item: {
    title: string;
    image?: string;
    amount: number;
  };
  itemType: 'course';
};
