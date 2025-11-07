import { Role } from '@/shared/enums/Role';
import { SessionStatus } from '@/shared/enums/SessionStatus';

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

  export type SessionParticipant = {
    id: string;
    name: string;
    image?: string;
  };

  export type UserSession = {
    id: string;
    startTime: string;
    endTime: string;
    status: SessionStatus;
    learner: SessionParticipant;
    instructor: SessionParticipant;
    createdAt: Date;
    updatedAt: Date;
  };

  export type GetUserSessionQueryParams = PaginationQueryParameters & {
    filter: {
      preferedRole: Role.INSTRUCTOR | Role.LEARNER;
      status?: SessionStatus;
      sort?: string;
      search?: string;
    };
  };

  export type GetUserSessionsResult = JsonApiResponse<UserSession[]> & {
    meta: Pagination;
  };

  export type AvailableSlots = {
    id: string;
    instructorId: string;
    startTime: string;
    endTime: string;
    status: 'BOOKED' | 'AVAILABLE';
  };

  export type ConnectionDetails = {
    serverUrl: string;
    roomName: string;
    participantName: string;
    participantToken: string;
  };

  export type JoinSessionResponse = {
    roomName: string;
    participantName: string;
    participantToken: string;
  };

  export type BookSessionResponse = JsonApiResponse<{
    referenceId: string;
    item: {
      title: string;
      image?: string;
      amount: number;
    };
    itemType: 'session';
  }>;
}

export {};
