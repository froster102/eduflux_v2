import type { Resolvers } from "@api/graphql/__generated__/resolvers-types";
import type { SubgraphContext } from "@api/graphql/handler/graphqlHandler";
import { getChatsSchema } from "@api/graphql/validation/schema";
import { ChatDITokens } from "@core/application/chat/di/ChatDITokens";
import type { GetChatsUseCase } from "@core/application/chat/usecase/GetChatsUseCase";
import type { AuthenticatedUserDto } from "@core/common/dto/AuthenticatedDto";
import { UnauthorizedException } from "@core/common/exception/UnauthorizedException";
import { inject } from "inversify";

export class ChatResolver {
  constructor(
    @inject(ChatDITokens.GetChatsUseCase)
    private readonly getChatsUseCase: GetChatsUseCase,
  ) {}

  getResolvers(): Resolvers {
    return {
      Query: {
        chats: async (_, args, context) => {
          const parsedArgs = getChatsSchema.parse(args);
          const result = await this.getChatsUseCase.execute({
            role: parsedArgs.role,
            userId: this.getAuthenticatedUser(context).id,
            queryParameters: {
              limit: parsedArgs.limit,
              offset: (parsedArgs.page - 1) * parsedArgs.limit,
            },
          });
          return {
            chats: result.chats.map((chat) => ({
              id: chat.id,
              lastMessageAt: chat.lastMessageAt.toISOString(),
              createdAt: chat.createdAt.toISOString(),
              participants: chat.participants.map((participant) => ({
                id: participant.userId,
              })),
            })),
            pagination: {
              totalPages: Math.ceil(result.totalCount / parsedArgs.limit),
              currentPage: args.page,
            },
          };
        },
      },
    };
  }

  private getAuthenticatedUser(context: SubgraphContext): AuthenticatedUserDto {
    const user = context.user;

    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }

    return user;
  }
}
