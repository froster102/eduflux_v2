import { authenticaionMiddleware } from '@api/http/middlewares/authenticationMiddleware';
import { bookingSchema, dateSchema } from '@api/http/validation/session';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { BookSessionUseCase } from '@core/application/session/usecase/BookSessionUseCase';
import type { JoinSessionUseCase } from '@core/application/session/usecase/JoinSessionUseCase';
import { SlotDITokens } from '@core/application/slot/di/SlotDITokens';
import type { GetInstructorAvailableSlotsUseCase } from '@core/application/slot/usecase/GetInstructorAvailableSlotsUseCase';
import { LiveKitConfig } from '@shared/config/LiveKitConfig';
import Elysia from 'elysia';
import { inject } from 'inversify';
import { WebhookReceiver } from 'livekit-server-sdk';
import httpStatus from 'http-status';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import type { LiveKitWebhookHandler } from '@infrastructure/adapter/livekit/LiveKitWebhookHandler';
import { UserSessionDITokens } from '@core/application/views/user-session/di/UserSessionDITokens';
import type { GetUserSessionsUseCase } from '@core/application/views/user-session/usecase/GetUserSessionsUseCase';
import { getUserSessionSchema } from '@api/http/validation/getUserSessionSchema';

export class SessionController {
  constructor(
    @inject(SessionDITokens.BookSessionUseCase)
    private readonly bookSessionUseCase: BookSessionUseCase,
    @inject(SlotDITokens.GetInstructorAvailableSlotsUseCase)
    private readonly getInstructorAvailableSlotsUseCase: GetInstructorAvailableSlotsUseCase,
    @inject(SessionDITokens.JoinSessionUseCase)
    private readonly joinSessionUseCase: JoinSessionUseCase,
    @inject(InfrastructureDITokens.LiveKitWebhookHandler)
    private readonly livekitWebhookHandler: LiveKitWebhookHandler,
    @inject(UserSessionDITokens.GetUserSessionsUseCase)
    private readonly getUserSessionsUseCase: GetUserSessionsUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/sessions', (group) =>
      group
        .post('/livekit/webhook', async ({ request, set }) => {
          const buffer = await request.arrayBuffer();
          const nodeBuffer = Buffer.from(buffer);
          const receiver = new WebhookReceiver(
            LiveKitConfig.LIVEKIT_API_KEY,
            LiveKitConfig.LIVEKIT_API_SECRET,
          );
          const event = await receiver.receive(
            nodeBuffer.toString(),
            request.headers.get('Authorization')!,
          );

          await this.livekitWebhookHandler.handleEvent(event);
          set.status = httpStatus.OK;
          return { success: true };
        })
        .use(authenticaionMiddleware)
        .post('/bookings', async ({ user, body }) => {
          const parsedBody = bookingSchema.parse(body);
          const response = await this.bookSessionUseCase.execute({
            slotId: parsedBody.slotId,
            userId: user.id,
          });

          return response;
        })
        .get('/instructors/:instructorId/slots', async ({ params, query }) => {
          const parsedQuery = dateSchema.parse(query);
          const response =
            await this.getInstructorAvailableSlotsUseCase.execute({
              instructorId: params.instructorId,
              date: parsedQuery.date,
              timeZone: parsedQuery.timeZone,
            });
          return response;
        })
        .get('/:sessionId/tokens', async ({ params, user }) => {
          const response = await this.joinSessionUseCase.execute({
            sessionId: params.sessionId,
            userId: user.id,
          });

          return response;
        })
        .get('/users/me', async ({ query, user }) => {
          const parsedQuery = getUserSessionSchema.parse(query);
          const { totalCount, sessions } =
            await this.getUserSessionsUseCase.execute({
              userId: user.id,
              preferedRole: parsedQuery.preferedRole,
              queryParameters: {
                limit: parsedQuery.limit,
                offset: (parsedQuery.page - 1) * parsedQuery.limit,
              },
            });
          return {
            pagination: {
              totalPages: Math.ceil(totalCount / parsedQuery.limit),
              currentPage: parsedQuery.page,
            },
            sessions,
          };
        }),
    );
  }
}
