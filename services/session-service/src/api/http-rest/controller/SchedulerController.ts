import { authenticaionMiddleware } from '@api/http-rest/middlewares/authenticationMiddleware';
import { bookingSchema, dateSchema } from '@api/http-rest/schema/session';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { BookSessionUseCase } from '@core/application/session/usecase/BookSessionUseCase';
import { SlotDITokens } from '@core/application/slot/di/SlotDITokens';
import type { GetInstructorAvailableSlotsUseCase } from '@core/application/slot/usecase/GetInstructorAvailableSlotsUseCase';
import Elysia from 'elysia';
import { inject } from 'inversify';

export class ScheduleController {
  constructor(
    @inject(SessionDITokens.BookSessionUseCase)
    private readonly bookSessionUseCase: BookSessionUseCase,
    @inject(SlotDITokens.GetInstructorAvailableSlotsUseCase)
    private readonly getInstructorAvailableSlotsUseCase: GetInstructorAvailableSlotsUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/sessions', (group) =>
      group
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
        }),
    );
  }
}
