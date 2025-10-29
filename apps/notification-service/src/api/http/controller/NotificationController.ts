import { authenticaionMiddleware } from '@api/http/middlewares/authenticationMiddleware';
import { NotificationDITokens } from '@core/application/notification/di/NotificationDITokens';
import type { NotificationUseCaseDto } from '@core/application/notification/usecase/dto/NotificationUseCaseDto';
import type { GetNotificationsUseCase } from '@core/application/notification/usecase/GetNotificationsUseCase';
import type { MarkNotificationAsSeenUseCase } from '@core/application/notification/usecase/MarkNotificationAsSeenUseCase';
import { eventEmitter } from '@core/common/util/event/eventEmitter';
import { ServerEvents } from '@shared/enum/ServerEvents';
import type { ServerEvent } from '@shared/types/ServerEvent';
import { jsonApiResponse } from '@eduflux-v2/shared/utils/jsonApi';
import Elysia from 'elysia';
import { inject } from 'inversify';
import { nanoid } from 'nanoid';

export class NotificationController {
  constructor(
    @inject(NotificationDITokens.GetNotificationsUseCase)
    private readonly getNotificationUseCase: GetNotificationsUseCase,
    @inject(NotificationDITokens.MarkNotificationAsSeenUseCase)
    private readonly markNotificationAsSeen: MarkNotificationAsSeenUseCase,
  ) {}

  register() {
    return new Elysia()
      .use(authenticaionMiddleware)
      .group('/api/notifications', (group) =>
        group
          .get('/events', ({ user, request }) => {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;
            const stream = new ReadableStream({
              start(controller) {
                const data = { message: 'connected' };
                const connectMessage = self.createServerSentEvent({
                  type: 'connection',
                  data,
                });
                controller.enqueue(new TextEncoder().encode(connectMessage));

                const handleEvent = (
                  event: ServerEvent<NotificationUseCaseDto>,
                ) => {
                  if (
                    event.type === ServerEvents.USER_NOTIFICATON &&
                    event.payload.userId === user.id
                  ) {
                    const notificationMessage = self.createServerSentEvent({
                      id: event.payload.id,
                      type: ServerEvents.USER_NOTIFICATON,
                      data: event.payload,
                    });
                    controller.enqueue(
                      new TextEncoder().encode(notificationMessage),
                    );
                  }
                };

                eventEmitter.on(ServerEvents.USER_NOTIFICATON, handleEvent);

                //Keep alive ping every 30seconds
                const pingInterval = setInterval(() => {
                  try {
                    const pingMessage = self.createServerSentEvent({
                      type: 'ping',
                      data: {},
                    });
                    controller.enqueue(new TextEncoder().encode(pingMessage));
                  } catch {
                    clearInterval(pingInterval);
                    controller.close();
                  }
                }, 30000);

                const cleanup = () => {
                  clearInterval(pingInterval);
                  try {
                    eventEmitter.off(
                      ServerEvents.USER_NOTIFICATON,
                      handleEvent,
                    );
                    controller.close();
                  } catch {
                    //controller already closed.
                  }
                };
                request.signal.addEventListener('abort', cleanup);

                //Additional cleanup for when the stream ends.
                return cleanup;
              },
            });

            return new Response(stream, {
              headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Cache-Control',
                'X-Accel-Buffering': 'no',
              },
            });
          })
          .get('/', async ({ user }) => {
            const response = await this.getNotificationUseCase.execute({
              userId: user.id,
            });
            return jsonApiResponse({ data: response });
          })
          .patch('/:id/seen', async ({ user, params }) => {
            await this.markNotificationAsSeen.execute({
              executorId: user.id,
              notificationId: params.id,
            });
            return;
          }),
      );
  }

  private createServerSentEvent<TData>({
    id,
    type,
    data,
  }: {
    id?: string;
    type: string;
    data: TData;
  }) {
    return `id: ${id || nanoid()}\nevent: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  }
}
