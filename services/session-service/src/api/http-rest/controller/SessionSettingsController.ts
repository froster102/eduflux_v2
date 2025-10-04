import { authenticaionMiddleware } from '@api/http-rest/middlewares/authenticationMiddleware';
import {
  enableSessionsSchema,
  updateSessionSettingsSchema,
} from '@api/http-rest/validation/session';
import { SessionSettingsDITokens } from '@core/application/session-settings/di/SessionSettingsDITokens';
import type { EnableSessionsUseCase } from '@core/application/session-settings/usecase/EnableSessionsUseCase';
import type { GetInstructorSessionSettingsUseCase } from '@core/application/session-settings/usecase/GetInstructorSessionSettingsUseCase';
import type { UpdateInstructorSessionSettingsUseCase } from '@core/application/session-settings/usecase/UpdateInstructorSessionSettingsUseCase';
import Elysia from 'elysia';
import { inject } from 'inversify';

export class SessionSettingsController {
  constructor(
    @inject(SessionSettingsDITokens.GetInstructorSessionSettingsUseCase)
    private readonly getInstructorSessionSettings: GetInstructorSessionSettingsUseCase,
    @inject(SessionSettingsDITokens.UpadteInstructorSessionSettingsUseCase)
    private readonly updateInstructorSessionSettingsUseCase: UpdateInstructorSessionSettingsUseCase,
    @inject(SessionSettingsDITokens.EnableSessionUseCase)
    private readonly enableSessionsUseCase: EnableSessionsUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/sessions/settings', (app) =>
      app
        .use(authenticaionMiddleware)
        .get('/', async ({ user }) => {
          const response = await this.getInstructorSessionSettings.execute({
            instructorId: user.id,
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
