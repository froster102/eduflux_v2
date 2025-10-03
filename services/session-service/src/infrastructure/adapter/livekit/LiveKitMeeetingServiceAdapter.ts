import type { MeetingServicePort } from '@core/application/session/port/gateway/MeetingServicePort';
import type { CreateParticipantOptions } from '@core/application/session/port/gateway/types/MeetingServiceOptions';
import { LiveKitConfig } from '@shared/config/LiveKitConfig';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

export class LiveKitMeetingServiceAdapter implements MeetingServicePort {
  private readonly LIVEKIT_API_SECRET;
  private readonly LIVEKIT_API_KEY;
  private readonly TTL = '10m';
  private readonly roomService: RoomServiceClient;
  private readonly LIVEKIT_HOST;

  constructor() {
    this.LIVEKIT_API_SECRET = LiveKitConfig.LIVEKIT_API_SECRET;
    this.LIVEKIT_API_KEY = LiveKitConfig.LIVEKIT_API_KEY;
    this.LIVEKIT_HOST = LiveKitConfig.LIVEKIT_HOST;
    this.roomService = new RoomServiceClient(
      this.LIVEKIT_HOST,
      this.LIVEKIT_API_KEY,
      this.LIVEKIT_API_SECRET,
    );
  }

  async createParticipantToken(
    options: CreateParticipantOptions,
  ): Promise<{ token: string }> {
    const { roomId, userId, userName, metadata } = options;
    const roomName = roomId;
    const participantName = userName;

    const at = new AccessToken(this.LIVEKIT_API_KEY, this.LIVEKIT_API_SECRET, {
      identity: userId,
      name: participantName,
      ttl: this.TTL,
      metadata,
    });

    at.addGrant({ roomJoin: true, room: roomName });

    return { token: await at.toJwt() };
  }

  async deleteRoom(roomId: string): Promise<void> {
    await this.roomService.deleteRoom(roomId);
  }
}
