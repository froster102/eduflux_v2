import {
  authenticaionMiddleware,
  type Env,
} from "@api/http-rest/middlewares/authenticationMiddleware";
import { ChatDITokens } from "@core/application/chat/di/ChatDITokens";
import type { CreateChatUseCase } from "@core/application/chat/usecase/CreateChatUseCase";
import type { GetChatUseCase } from "@core/application/chat/usecase/GetChatUseCase";
import { Hono } from "hono";
import { inject } from "inversify";

import { MessageDITokens } from "@core/application/message/di/MessageDITokens";
import type { GetMessagesUseCase } from "@core/application/message/usecase/GetMessagesUseCase";
import {
  createChatSchema,
  getChatExistsSchema,
  getMessagesSchema,
} from "@api/validation/schema";

export class ChatController {
  constructor(
    @inject(ChatDITokens.CreateChatUseCase)
    private readonly createChatUseCase: CreateChatUseCase,
    @inject(ChatDITokens.GetChatUseCase)
    private readonly getChatUseCase: GetChatUseCase,
    @inject(MessageDITokens.GetMessagesUseCase)
    private readonly getMessagesUseCase: GetMessagesUseCase,
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
        const response = await this.getChatUseCase.execute({
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
      });
  }
}
