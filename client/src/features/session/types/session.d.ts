declare global {
  export type SessionSettings = {
    price: number;
    currency: string;
    duration: number;
    weeklySchedules: DailyAvailabilityConfig[];
    slotDurationMinutes: number;
    applyForWeeks: number;
    timeZone: string;
    createdAt: Date;
    updatedAt: Date;
  };

  export type DailyAvailabilityConfig = {
    dayOfWeek: number;
    enabled: boolean;
    startTime?: string;
    endTime?: string;
  };
}

export {};
