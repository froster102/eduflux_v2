import { authenticaionMiddleware } from "@api/http-rest/middleware/authenticationMiddleware";
import { getUserChatsSchema } from "@api/http-rest/validation/userChatSchema";
import { UserChatDITokens } from "@core/application/user-chat/di/UserChatDITokens";
import type { GetUserChatsUseCase } from "@core/application/user-chat/usecase/GetUserChatsUseCase";
import Elysia from "elysia";
import { inject } from "inversify";

export class UserChatController {
  constructor(
    @inject(UserChatDITokens.GetUserChatsUserCase)
    private readonly getUserChatsUseCase: GetUserChatsUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group("/api/query/chats", (app) =>
      app.use(authenticaionMiddleware).get("/", async ({ query, user }) => {
        const parsedQuery = getUserChatsSchema.parse(query);
        const { chats, totalCount } = await this.getUserChatsUseCase.execute({
          role: parsedQuery.role,
          userId: user.id,
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
          chats,
        };
      }),
    );
  }
}
