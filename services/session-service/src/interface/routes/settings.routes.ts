import type { IEnableSessionsUseCase } from '@/application/use-cases/interface/enable-sessions.interface';
import type { IGetInstructorSessionSettingsUseCase } from '@/application/use-cases/interface/get-instructor-session-settings.interface';
import type { IUpdateInstructorSessionSettingsUseCase } from '@/application/use-cases/interface/update-instuctor-session-settings.interface';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import {
  enableSessionsSchema,
  updateSessionSettingsSchema,
} from '@/infrastructure/http/schema/session';
import { TYPES } from '@/shared/di/types';
import Elysia from 'elysia';
import { inject } from 'inversify';

export class SettingsRoutes {
  constructor(
    @inject(TYPES.GetInstructorSessionSettingsUseCase)
    private readonly getInstructorSessionSettings: IGetInstructorSessionSettingsUseCase,
    @inject(TYPES.UpadteInstructorSessionSettingsUseCase)
    private readonly updateInstructorSessionSettingsUseCase: IUpdateInstructorSessionSettingsUseCase,
    @inject(TYPES.EnableSessionUseCase)
    private readonly enableSessionsUseCase: IEnableSessionsUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/sessions/settings', (app) =>
      app
        .use(authenticaionMiddleware)
        .get('/', async ({ user }) => {
          const response = await this.getInstructorSessionSettings.execute({
            actor: user,
          });
          return response;
        })
        .post('/', async ({ body, user }) => {
          const parsedBody = enableSessionsSchema.parse(body);
          await this.enableSessionsUseCase.execute({
            ...parsedBody,
            executorId: user.id,
          });
        })
        .put('/', async ({ user, body }) => {
          const parsedBody = updateSessionSettingsSchema.parse(body);
          await this.updateInstructorSessionSettingsUseCase.execute({
            executorId: user.id,
            ...parsedBody,
          });
        }),
    );
  }
}
