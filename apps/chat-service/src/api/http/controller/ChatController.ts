import {
  authenticaionMiddleware,
  type Env,
} from '@api/http/middlewares/authenticationMiddleware';
import { ChatDITokens } from '@core/application/chat/di/ChatDITokens';
import type { CreateChatUseCase } from '@core/application/chat/usecase/CreateChatUseCase';
import type { GetChatWithInstructorUseCase } from '@core/application/chat/usecase/GetChatWithInstructorUseCase';
import { Hono } from 'hono';
import { inject } from 'inversify';

import { MessageDITokens } from '@core/application/message/di/MessageDITokens';
import type { GetMessagesUseCase } from '@core/application/message/usecase/GetMessagesUseCase';
import {
  createChatSchema,
  getChatExistsSchema,
  getMessagesSchema,
} from '@api/validation/schema';
import { getUserChatsSchema } from '@api/validation/getUserChatsSchema';
import { UserChatDITokens } from '@core/application/views/user-chat/di/UserChatDITokens';
import type { GetUserChatsUseCase } from '@core/application/views/user-chat/usecase/GetUserChatsUseCase';
import { calculateOffset } from '@eduflux-v2/shared/utils/helper';
import {
  jsonApiResponse,
  parseJsonApiQuery,
} from '@eduflux-v2/shared/utils/jsonApi';
import httpStatus from 'http-status';

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
      .post('/', async (c) => {
        const parsedBody = createChatSchema.parse(await c.req.json());
        const result = await this.createChatUseCase.execute({
          instructorId: parsedBody.instructorId,
          userId: c.get('user').id,
        });
        const response = jsonApiResponse({
          data: result,
        });

        return c.json(response, httpStatus.CREATED);
      })
      .get('/exists', async (c) => {
        const jsonApiQuery = parseJsonApiQuery(c.req.query());
        const parsedQuery = getChatExistsSchema.parse(jsonApiQuery);
        const response = await this.getChatWithInstructorUseCase.execute({
          instructorId: parsedQuery.filter.instructorId,
          learnerId: c.get('user').id,
        });
        return c.json(jsonApiResponse({ data: response }));
      })
      .get('/me', async (c) => {
        const jsonApiQuery = parseJsonApiQuery(c.req.query());
        const parsedQuery = getUserChatsSchema.parse(jsonApiQuery);
        const { totalCount, chats } = await this.getUserChatsUseCase.execute({
          role: parsedQuery.filter.role,
          paginationQueryParams: {
            limit: parsedQuery.page.size,
            offset: calculateOffset(parsedQuery.page),
          },
          userId: c.get('user').id,
        });
        const response = jsonApiResponse({
          data: chats,
          pageNumber: parsedQuery.page.number,
          pageSize: parsedQuery.page.size,
          totalCount,
        });
        return c.json(response);
      })
      .get('/:id', async (c) => {
        const jsonApiQuery = parseJsonApiQuery(c.req.query());
        const parsedQuery = getMessagesSchema.parse(jsonApiQuery);
        const response = await this.getMessagesUseCase.execute({
          chatId: c.req.param('id'),
          userId: c.get('user').id,
          queryParameters: {
            before: parsedQuery.page.cursor,
          },
        });
        return c.json(
          jsonApiResponse({
            data: response.messages,
          }),
        );
      });
  }
}
