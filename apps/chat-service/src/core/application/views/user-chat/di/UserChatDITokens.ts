export class UserChatDITokens {
  //Use-cases
  static readonly GetUserChatsUserCase: unique symbol = Symbol(
    "GetUserChatsUserCase",
  );

  //Handler
  static readonly UserChatCreatedEventHandler: unique symbol = Symbol(
    "UserChatCreatedEventHandler",
  );
  static readonly UserUpdatedEventHandler: unique symbol = Symbol(
    "UserUpdatedEventHandler",
  );

  //Repository
  static readonly UserChatRepository: unique symbol =
    Symbol("UserChatRepository");

  //Controller
  static readonly UserChatController: unique symbol =
    Symbol("UserChatController");
}
