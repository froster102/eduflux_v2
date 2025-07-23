import type { IUseCase } from '@/application/use-cases/interface/use-case.interface';
import {
  GetInstructorScheduleTemplateInput,
  GetInstructorScheduleTemplateOutput,
} from '@/application/use-cases/get-instructor-schedule-template.use-case';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import { TYPES } from '@/shared/di/types';
import Elysia from 'elysia';
import { inject } from 'inversify';
import { UpdateInstructorWeeklyAvailabilityInput } from '@/application/use-cases/update-instructor-weekly-availablity.use-case';
import { availabilitySchema } from '@/infrastructure/http/schema/session.schema';

export class ScheduleRoutes {
  constructor(
    @inject(TYPES.GetInstructorScheduleTemplateUseCase)
    private readonly getInstructorScheduleTemplateUseCase: IUseCase<
      GetInstructorScheduleTemplateInput,
      GetInstructorScheduleTemplateOutput
    >,
    @inject(TYPES.UpdateInstructorWeeklyAvailabilityUseCase)
    private readonly updateInstructorWeeklyAvailabilityUseCase: IUseCase<
      UpdateInstructorWeeklyAvailabilityInput,
      void
    >,
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
          });
        }),
    );
  }
}
