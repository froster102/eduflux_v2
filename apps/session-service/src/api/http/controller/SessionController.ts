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
import { jsonApiResponse, parseJsonApiQuery } from '@shared/utils/jsonApi';
import { calculateOffset } from '@shared/utils/helper';

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

          return jsonApiResponse({ data: response });
        })
        .get('/instructors/:instructorId/slots', async ({ params, query }) => {
          const jsonApiQuery = parseJsonApiQuery(query);
          const parsedQuery = dateSchema.parse(jsonApiQuery);
          const response =
            await this.getInstructorAvailableSlotsUseCase.execute({
              instructorId: params.instructorId,
              date: parsedQuery.filter.date,
              timeZone: parsedQuery.filter.timeZone,
            });
          return jsonApiResponse({ data: response });
        })
        .get('/:sessionId/tokens', async ({ params, user }) => {
          const response = await this.joinSessionUseCase.execute({
            sessionId: params.sessionId,
            userId: user.id,
          });

          return jsonApiResponse({ data: response });
        })
        .get('/me', async ({ query, user }) => {
          const jsonApiQuery = parseJsonApiQuery(query);
          const parsedQuery = getUserSessionSchema.parse(jsonApiQuery);
          const { totalCount, sessions } =
            await this.getUserSessionsUseCase.execute({
              userId: user.id,
              preferedRole: parsedQuery.filter.preferedRole,
              queryParameters: {
                limit: parsedQuery.page.size,
                offset: calculateOffset({
                  number: parsedQuery.page.number,
                  size: parsedQuery.page.size,
                }),
              },
            });
          return jsonApiResponse({
            data: sessions,
            totalCount,
            pageNumber: parsedQuery.page.number,
            pageSize: parsedQuery.page.size,
          });
        }),
    );
  }
}
