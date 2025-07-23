declare global {
  export type ScheduleSetting = {
    weeklySchedule: DailyAvailabilityConfig[];
    slotDurationMinutes: number;
    applyForWeeks: number;
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
