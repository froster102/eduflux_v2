import { authenticaionMiddleware } from "@api/http-rest/middleware/authenticationMiddleware";
import { getUserSessionSchema } from "@api/http-rest/validation/userSessionSchema";
import { UserSessionDITokens } from "@core/application/user-session/di/UserSessionDITokens";
import type { GetUserSessionsUseCase } from "@core/application/user-session/usecase/GetUserSessionsUseCase";
import Elysia from "elysia";
import { inject } from "inversify";

export class UserSessionController {
  constructor(
    @inject(UserSessionDITokens.GetUserSessionsUseCase)
    private readonly getUserSessions: GetUserSessionsUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group("/api/query/sessions", (app) =>
      app.use(authenticaionMiddleware).get("/", async ({ query, user }) => {
        const parsedQuery = getUserSessionSchema.parse(query);
        const { totalCount, sessions } = await this.getUserSessions.execute({
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
