import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { CompleteSessionOnFinishUseCase } from '@core/application/session/usecase/CompleteSessionOnFinishUseCase';
import type { StartSessionOnJoinUseCase } from '@core/application/session/usecase/StartSessionOnJoinUseCase';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { inject } from 'inversify';
import type { WebhookEvent } from 'livekit-server-sdk';

export class LiveKitWebhookHandler {
  private readonly logger: LoggerPort;
  constructor(
    @inject(SessionDITokens.StartSessionOnJoinUseCase)
    private readonly startSessionOnJoinUseCase: StartSessionOnJoinUseCase,
    @inject(SessionDITokens.CompleteSessionOnFinishUseCase)
    private readonly completeSessionOnFinishUseCase: CompleteSessionOnFinishUseCase,
    @inject(CoreDITokens.Logger)
    logger: LoggerPort,
  ) {
    this.logger = logger.fromContext(LiveKitWebhookHandler.name);
  }

  public async handleEvent(event: WebhookEvent): Promise<void> {
    this.logger.debug(
      `Processing event: ${event.event} for room: ${event.room?.name}`,
    );

    switch (event.event) {
      case 'participant_joined':
        if (event.room && event.participant) {
          await this.startSessionOnJoinUseCase.execute({
            sessionId: event.room.name,
            userId: event.participant?.name,
          });
        }
        break;

      case 'room_finished':
        if (event.room) {
          await this.completeSessionOnFinishUseCase.execute({
            sessionId: event.room.name,
          });
        }
        break;

      case 'participant_left':
      case 'room_started':
      case 'track_published':
      case 'track_unpublished':
        break;

      default:
        this.logger.warn(
          `[LiveKit Webhook] Ignored non-critical event: ${event.event}`,
        );
        break;
    }
  }
}
