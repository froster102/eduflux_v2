export class MessageDITokens {
  //Use-cases
  static readonly CreateMessageUseCase: unique symbol = Symbol(
    "CreateMessageUseCase",
  );
  static readonly GetMessagesUseCase: unique symbol =
    Symbol("GetMessagesUseCase");
  static readonly UpdateMessageStatusUseCase: unique symbol = Symbol(
    "UpdateMessageStatusUseCase",
  );

  //Repository
  static readonly MessageRepository: unique symbol =
    Symbol("MessageRepository");
}
