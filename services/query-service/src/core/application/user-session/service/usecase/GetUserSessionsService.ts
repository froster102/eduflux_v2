import { UserSessionDITokens } from "@core/application/user-session/di/UserSessionDITokens";
import type { UserSessionRepositoryPort } from "@core/application/user-session/port/persistence/UserSessionRepositoryPort";
import type { GetUserSessionsPort } from "@core/application/user-session/port/usecase/GetUserSessionsPort";
import type { GetUserSessionsUseCaseResult } from "@core/application/user-session/port/usecase/type/GetUserSessionsUseCaseResult";
import type { GetUserSessionsUseCase } from "@core/application/user-session/usecase/GetUserSessionsUseCase";
import { inject } from "inversify";

export class GetUserSessionService implements GetUserSessionsUseCase {
  constructor(
    @inject(UserSessionDITokens.UserSessionRepository)
    private readonly userSessionRepository: UserSessionRepositoryPort,
  ) {}

  async execute(
    payload: GetUserSessionsPort,
  ): Promise<GetUserSessionsUseCaseResult> {
    const { userId, preferedRole, queryParameters } = payload;

    const result = await this.userSessionRepository.listUserSessions(
      userId,
      preferedRole,
      queryParameters,
    );

    return result;
  }
}
