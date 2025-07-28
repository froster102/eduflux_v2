declare global {
  export type ScheduleSetting = {
    weeklySchedule: DailyAvailabilityConfig[];
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

  export type SessionPricing = {
    id: string;
    price: number;
    currency: string;
    duration: number;
  } | null;
}

export {};
