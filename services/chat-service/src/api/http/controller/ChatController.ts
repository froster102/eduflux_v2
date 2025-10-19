import {
  authenticaionMiddleware,
  type Env,
} from "@api/http/middlewares/authenticationMiddleware";
import { ChatDITokens } from "@core/application/chat/di/ChatDITokens";
import type { CreateChatUseCase } from "@core/application/chat/usecase/CreateChatUseCase";
import type { GetChatWithInstructorUseCase } from "@core/application/chat/usecase/GetChatWithInstructorUseCase";
import { Hono } from "hono";
import { inject } from "inversify";

import { MessageDITokens } from "@core/application/message/di/MessageDITokens";
import type { GetMessagesUseCase } from "@core/application/message/usecase/GetMessagesUseCase";
import {
  createChatSchema,
  getChatExistsSchema,
  getMessagesSchema,
} from "@api/validation/schema";
import { getUserChatsSchema } from "@api/validation/getUserChatsSchema";
import { UserChatDITokens } from "@core/application/views/user-chat/di/UserChatDITokens";
import type { GetUserChatsUseCase } from "@core/application/views/user-chat/usecase/GetUserChatsUseCase";
import { calculateOffset } from "@shared/utils/helper";

export class ChatController {
  constructor(
    @inject(ChatDITokens.CreateChatUseCase)
    private readonly createChatUseCase: CreateChatUseCase,
    @inject(ChatDITokens.GetChatWithInstructorUseCase)
    private readonly getChatWithInstructorUseCase: GetChatWithInstructorUseCase,
    @inject(MessageDITokens.GetMessagesUseCase)
    private readonly getMessagesUseCase: GetMessagesUseCase,
    @inject(UserChatDITokens.GetUserChatsUserCase)
    private readonly getUserChatsUseCase: GetUserChatsUseCase,
  ) {}

  register() {
    return new Hono<Env>()
      .use(authenticaionMiddleware)
      .post("/", async (c) => {
        const parsedBody = createChatSchema.parse(await c.req.json());
        const response = await this.createChatUseCase.execute({
          instructorId: parsedBody.instructorId,
          userId: c.get("user").id,
        });
        return c.json(response);
      })
      .get("/exists", async (c) => {
        const parsedQuery = getChatExistsSchema.parse(c.req.query());
        const response = await this.getChatWithInstructorUseCase.execute({
          instructorId: parsedQuery.instructorId,
          learnerId: c.get("user").id,
        });
        return c.json(response);
      })
      .get("/:id", async (c) => {
        const parsedQuery = getMessagesSchema.parse(c.req.query());
        const response = await this.getMessagesUseCase.execute({
          chatId: c.req.param("id"),
          userId: c.get("user").id,
          queryParameters: {
            before: parsedQuery.before,
          },
        });
        return c.json({
          messages: response.messages,
        });
      })
      .get("/users/me", async (c) => {
        const parsedQuery = getUserChatsSchema.parse(c.req.query());
        const { totalCount, chats } = await this.getUserChatsUseCase.execute({
          role: parsedQuery.role,
          queryParameters: {
            limit: parsedQuery.limit,
            offset: calculateOffset(parsedQuery.page, parsedQuery.limit),
          },
          userId: c.get("user").id,
        });

        return c.json({
          pagination: {
            totalPages: Math.ceil(totalCount / parsedQuery.limit),
            currentPage: parsedQuery.page,
          },
          chats,
        });
      });
  }
}
