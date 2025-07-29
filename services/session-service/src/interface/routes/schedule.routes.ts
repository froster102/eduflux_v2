import type { IGetInstructorScheduleTemplateUseCase } from '@/application/use-cases/interface/get-instructor-schedule-template.interface';
import type { IUpdateInstructorWeeklyAvailabilityUseCase } from '@/application/use-cases/interface/update-instructor-weekly-availablity.interface';
import type { IBookSessionUseCase } from '@/application/use-cases/interface/book-session.interface';
import type { IGetInstructorAvailableSlotsUseCase } from '@/application/use-cases/interface/get-instructor-available-slots.interface';

import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import { TYPES } from '@/shared/di/types';
import Elysia from 'elysia';
import { inject } from 'inversify';
import {
  availabilitySchema,
  bookingSchema,
  dateSchema,
} from '@/infrastructure/http/schema/session.schema';

export class ScheduleRoutes {
  constructor(
    @inject(TYPES.GetInstructorScheduleTemplateUseCase)
    private readonly getInstructorScheduleTemplateUseCase: IGetInstructorScheduleTemplateUseCase,
    @inject(TYPES.UpdateInstructorWeeklyAvailabilityUseCase)
    private readonly updateInstructorWeeklyAvailabilityUseCase: IUpdateInstructorWeeklyAvailabilityUseCase,
    @inject(TYPES.BookSessionUseCase)
    private readonly bookSessionUseCase: IBookSessionUseCase,
    @inject(TYPES.GetInstructorAvailableSlotsUseCase)
    private readonly getInstructorAvailableSlotsUseCase: IGetInstructorAvailableSlotsUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/sessions', (group) =>
      group
        .use(authenticaionMiddleware)
        .get('/me/schedule-setting', async ({ user }) => {
          const response =
            await this.getInstructorScheduleTemplateUseCase.execute({
              actor: user,
            });
          return response;
        })
        .put('/me/schedule', async ({ user, body }) => {
          const parsedBody = availabilitySchema.parse(body);
          await this.updateInstructorWeeklyAvailabilityUseCase.execute({
            actor: user,
            applyForWeeks: parsedBody.applyForWeeks,
            weeklySchedule: parsedBody.weeklySchedule,
            timeZone: parsedBody.timeZone,
          });
        })
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
