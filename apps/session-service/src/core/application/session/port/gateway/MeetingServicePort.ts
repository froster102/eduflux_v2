import type { CreateParticipantOptions } from '@core/application/session/port/gateway/types/MeetingServiceOptions';

export interface MeetingServicePort {
  createParticipantToken(
    options: CreateParticipantOptions,
  ): Promise<{ token: string }>;
  deleteRoom(roomId: string): Promise<void>;
}
