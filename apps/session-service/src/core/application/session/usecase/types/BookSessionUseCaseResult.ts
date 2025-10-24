export type BookSessionUseCaseResult = {
  referenceId: string;
  item: {
    title: string;
    image?: string;
    amount: number;
  };
  itemType: 'session';
};
