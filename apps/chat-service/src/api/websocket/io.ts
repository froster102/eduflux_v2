import { Server, type DefaultEventsMap } from 'socket.io';
import type { Server as HTTPServer } from 'node:http';
import { validateToken } from '@shared/utils/jwt.util';
import { tryCatch } from '@shared/utils/try-catch';
import { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedDto';
import { parseCookieHeader } from '@shared/utils/helper';
import { WebSocketEvents } from '@shared/enums/WebSocketEvents';
import { container } from '@di/RootModule';
import { ChatDITokens } from '@core/application/chat/di/ChatDITokens';
import type { VerifyChatParticipantUseCase } from '@core/application/chat/usecase/VerifyChatParticipantUseCase';
import { Code } from '@core/common/error/Code';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { CreateMessageUseCase } from '@core/application/message/usecase/CreateMessageUseCase';
import { MessageDITokens } from '@core/application/message/di/MessageDITokens';
import type { UpdateMessageStatusUseCase } from '@core/application/message/usecase/UpdateMessageStatusUseCase';
import { MessageStatus } from '@core/common/enum/MessageStatus';
import type { GetChatUseCase } from '@core/application/chat/usecase/GetChatUseCase';
import type { Socket } from 'socket.io';
import type { Role } from '@core/common/enum/Role';

interface SocketData {
  user: AuthenticatedUserDto;
}

export class SocketIOServer {
  private readonly logger: LoggerPort;
  private readonly onlineUsers: Map<string, string> = new Map();
  private readonly io: Server<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    SocketData
  >;
  private readonly createMessageUseCase: CreateMessageUseCase;
  private readonly updateMessageStatusUseCase: UpdateMessageStatusUseCase;
  private readonly getChatUseCase: GetChatUseCase;
  private readonly verifyChatParticipantUseCase: VerifyChatParticipantUseCase;

  constructor(httpServer: HTTPServer) {
    this.logger = container
      .get<LoggerPort>(CoreDITokens.Logger)
      .fromContext(SocketIOServer.name);
    this.createMessageUseCase = container.get<CreateMessageUseCase>(
      MessageDITokens.CreateMessageUseCase,
    );
    this.getChatUseCase = container.get<GetChatUseCase>(
      ChatDITokens.GetChatUseCase,
    );
    this.updateMessageStatusUseCase = container.get<UpdateMessageStatusUseCase>(
      MessageDITokens.UpdateMessageStatusUseCase,
    );
    this.verifyChatParticipantUseCase =
      container.get<VerifyChatParticipantUseCase>(
        ChatDITokens.VerifyChatParticipantUseCase,
      );

    this.io = new Server<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap,
      SocketData
    >(httpServer, {
      path: '/ws/chats/',
    });
    this.setupMiddleware();
    this.setupSocketListeners();
  }

  setupMiddleware() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.io.use(async (socket, next) => {
      const cookie = parseCookieHeader(socket.handshake.headers['cookie']!);
      const token = cookie.get('user_jwt');
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const { data: payload, error } = await tryCatch(validateToken(token));

      if (error) {
        next(new Error('Authentication error: Invalid token'));
      }

      if (payload) {
        socket.data.user = new AuthenticatedUserDto(
          payload.id,
          payload.name,
          payload.email,
          payload.roles as Role[],
        );
      }

      next();
    });
  }

  setupSocketListeners() {
    this.io.on(WebSocketEvents.CONNECTION, (socket) => {
      this.logger.debug(`A user connected: ${socket.id}`);

      this.onlineUsers.set(socket.data.user.id, socket.id);

      socket.on(
        WebSocketEvents.MESSAGE_SEND,
        async (payload: { chatId: string; content: string }) => {
          const { chatId, content } = payload;
          const senderId = socket.data.user.id;

          const { data: chat, error: getChatUseCaseError } = await tryCatch(
            this.getChatUseCase.execute({ chatId }),
          );

          if (getChatUseCaseError) {
            this.handleError(socket, getChatUseCaseError);
            return;
          }

          const { data: savedMessage, error } = await tryCatch(
            this.createMessageUseCase.execute({ chatId, senderId, content }),
          );

          if (error) {
            this.handleError(socket, error);
            return;
          }

          let messageStatusToEmit = savedMessage.status;

          const recipientId = chat.participants.find(
            (p) => p.userId !== socket.data.user.id,
          )?.userId;

          if (recipientId && this.onlineUsers.has(recipientId)) {
            const { error } = await tryCatch(
              this.updateMessageStatusUseCase.execute({
                chatId,
                executorId: recipientId,
                messageId: savedMessage.id,
                status: MessageStatus.DELIVERED,
              }),
            );

            if (error) {
              this.handleError(socket, error);
              return;
            }
            messageStatusToEmit = MessageStatus.DELIVERED;
          }

          this.io.to(chatId).emit(WebSocketEvents.MESSAGE_NEW, {
            message: { ...savedMessage, status: messageStatusToEmit },
          });
        },
      );

      socket.on(WebSocketEvents.CHAT_JOIN, async (data: { chatId: string }) => {
        const { data: result, error } = await tryCatch(
          this.verifyChatParticipantUseCase.execute({
            userId: socket.data.user.id,
            chatId: data.chatId,
          }),
        );

        if (error) {
          this.handleError(socket, error);
          return;
        }

        if (!result.isParticipant) {
          socket.emit(WebSocketEvents.ERROR, {
            message: Code.FORBIDDEN_ERROR.message,
          });
        }

        await socket.join(data.chatId);

        this.logger.debug(
          `User ${socket.data.user.id} has join room ${data.chatId}`,
        );
      });

      socket.on(
        WebSocketEvents.MESSAGE_DELIVERED,
        async (data: { messageId: string; chatId: string }) => {
          const { messageId, chatId } = data;
          const { error } = await tryCatch(
            this.updateMessageStatusUseCase.execute({
              messageId,
              status: MessageStatus.DELIVERED,
              chatId,
              executorId: socket.data.user.id,
            }),
          );

          if (error) {
            this.handleError(socket, error);
            return;
          }

          this.io.to(chatId).emit(WebSocketEvents.MESSAGE_STATUS_UPDATE, {
            messageId,
            status: MessageStatus.DELIVERED,
          });
        },
      );

      socket.on(
        WebSocketEvents.MESSAGE_READ,
        async (data: { messageId: string; chatId: string }) => {
          const { messageId, chatId } = data;
          const { error } = await tryCatch(
            this.updateMessageStatusUseCase.execute({
              messageId,
              status: MessageStatus.READ,
              chatId,
              executorId: socket.data.user.id,
            }),
          );

          if (error) {
            this.logger.error(
              `Failed to update message status to read: ${error.message}`,
            );
            return;
          }

          this.io.to(chatId).emit(WebSocketEvents.MESSAGE_STATUS_UPDATE, {
            messageId,
            status: MessageStatus.READ,
          });
        },
      );

      socket.on(
        WebSocketEvents.CHAT_LEAVE,
        async (data: { chatId: string }) => {
          await socket.leave(data.chatId);
          this.logger.debug(
            `User ${socket.data.user.id} has left room ${data.chatId}`,
          );
        },
      );

      socket.on(WebSocketEvents.DISCONNECT, () => {
        this.logger.debug(`User disconnected: ${socket.id}`);
      });
    });
  }

  private handleError(socket: Socket, error: Error) {
    this.logger.error(
      `An error has occurred: ${error.message}`,
      error as Record<string, any>,
    );

    socket.emit(WebSocketEvents.ERROR, { message: error.message });
  }
}
