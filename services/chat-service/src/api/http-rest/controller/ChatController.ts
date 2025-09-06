import { authenticaionMiddleware } from "@api/http-rest/middlewares/authenticationMiddleware";
import { ChatDITokens } from "@core/application/chat/di/ChatDITokens";
import type { CreateChatUseCase } from "@core/application/chat/usecase/CreateChatUseCase";
import type { GetChatUseCase } from "@core/application/chat/usecase/GetChatUseCase";
import Elysia, { t } from "elysia";
import { inject } from "inversify";

export class ChatController {
  constructor(
    @inject(ChatDITokens.CreateChatUseCase)
    private readonly createChatUseCase: CreateChatUseCase,
    @inject(ChatDITokens.GetChatUseCase)
    private readonly getChatUseCase: GetChatUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group("/api/chats", (group) =>
      group
        .use(authenticaionMiddleware)
        .post(
          "/",
          async ({ user, body }) => {
            const response = await this.createChatUseCase.execute({
              instructorId: body.instructorId,
              userId: user.id,
            });
            return JSON.stringify(response);
          },
          {
            body: t.Object({
              instructorId: t.String(),
            }),
          },
        )
        .get(
          "/exists",
          async ({ query, user }) => {
            const response = await this.getChatUseCase.execute({
              instructorId: query.instructorId,
              learnerId: user.id,
            });
            return response;
          },
          {
            query: t.Object({
              instructorId: t.String(),
            }),
          },
        ),
    );
  }
}
