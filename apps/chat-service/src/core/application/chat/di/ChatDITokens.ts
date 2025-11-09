export class ChatDITokens {
  //Use-case
  static readonly CreateChatUseCase: unique symbol =
    Symbol('CreateChatUseCase');
  static readonly GetChatsUseCase: unique symbol = Symbol('GetChatsUseCase');
  static readonly GetChatWithInstructorUseCase: unique symbol = Symbol(
    'GetChatWithInstructorUseCase',
  );
  static readonly GetChatUseCase: unique symbol = Symbol('GetChatUseCase');
  static readonly VerifyChatParticipantUseCase: unique symbol = Symbol(
    'VerifyChatParticipantUseCase',
  );

  //Repository
  static readonly ChatRepository: unique symbol = Symbol('ChatRepository');

  //Controller
  static readonly ChatController: unique symbol = Symbol('ChatController');
}
