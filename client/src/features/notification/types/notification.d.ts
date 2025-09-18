declare global {
  export type AppNotification = {
    id: string;
    userId: string;
    title: string;
    description: string;
    path: string;
    status: NotificationStatus;
    timestamp: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export {};
