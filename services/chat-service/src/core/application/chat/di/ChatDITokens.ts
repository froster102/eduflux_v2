export class ChatDITokens {
  //Use-case
  static readonly CreateChatUseCase: unique symbol =
    Symbol("CreateChatUseCase");
  static readonly GetChatsUseCase: unique symbol = Symbol("GetChatsUseCase");
  static readonly GetChatUseCase: unique symbol = Symbol("GetChatUseCase");

  //Repository
  static readonly ChatRepository: unique symbol = Symbol("ChatRepository");

  //Controller
  static readonly ChatController: unique symbol = Symbol("ChatController");
}
