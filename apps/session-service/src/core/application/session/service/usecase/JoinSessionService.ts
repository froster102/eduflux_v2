import { inject } from 'inversify';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { JoinSessionUseCase } from '@core/application/session/usecase/JoinSessionUseCase';
import type { JoinSessionUseCaseResult } from '@core/application/session/usecase/types/JoinSessionUseCaseResult';
import type { MeetingServicePort } from '@core/application/session/port/gateway/MeetingServicePort';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import type { JoinSessionPort } from '@core/application/session/port/usecase/JoinSessionPort';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import { ForbiddenException } from '@eduflux-v2/shared/exceptions/ForbiddenException';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { ConflictException } from '@eduflux-v2/shared/exceptions/ConflictException';
import { SessionStatus } from '@eduflux-v2/shared/constants/SessionStatus';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';

export class JoinSessionService implements JoinSessionUseCase {
  constructor(
    @inject(SessionDITokens.SessionRepository)
    private readonly sessionRepository: SessionRepositoryPort,
    @inject(CoreDITokens.UserService)
    private readonly userService: UserServicePort,
    @inject(SessionDITokens.MeetingService)
    private readonly meetingService: MeetingServicePort,
  ) {}

  async execute(payload: JoinSessionPort): Promise<JoinSessionUseCaseResult> {
    const { sessionId, userId } = payload;
    const now = new Date();

    const user = CoreAssert.notEmpty(
      await this.userService.getUser(userId),
      new NotFoundException('User not found'),
    );

    const session = CoreAssert.notEmpty(
      await this.sessionRepository.findById(sessionId),
      new NotFoundException('Session not found.'),
    );

    if (!session.isParticipant(userId)) {
      throw new ForbiddenException('Unauthorized to join this session.');
    }

    const joinableStatuses = [
      SessionStatus.CONFIRMED,
      SessionStatus.IN_PROGRESS,
    ];
    if (!joinableStatuses.includes(session.status)) {
      throw new ForbiddenException(
        `Session status is '${session.status}', cannot be joined.`,
      );
    }

    if (session.endTime <= now) {
      throw new ForbiddenException('The session has already ended.');
    }

    const joinBufferMinutes = 5;
    const earliestJoinTime = new Date(
      session.startTime.getTime() - joinBufferMinutes * 60000,
    );

    if (now < earliestJoinTime) {
      throw new ConflictException(
        `Session is scheduled to start at ${session.startTime.toISOString()}. You can join at ${earliestJoinTime.toISOString()}.`,
      );
    }

    const { token } = await this.meetingService.createParticipantToken({
      roomId: session.id,
      userId,
      userName: user.firstName + ' ' + user.lastName,
    });

    return {
      participantToken: token,
      participantName: user.firstName + ' ' + user.lastName,
      roomName: session.id,
    };
  }
}
