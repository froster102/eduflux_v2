declare global {
  export type CheckoutItem = {
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
