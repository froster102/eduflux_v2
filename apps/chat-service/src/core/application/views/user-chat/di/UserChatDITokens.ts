export class UserChatDITokens {
  //Use-cases
  static readonly GetUserChatsUserCase: unique symbol = Symbol(
    'GetUserChatsUserCase',
  );

  //Subscribers
  static readonly UserChatCreatedEventSubscriber: unique symbol = Symbol(
    'UserChatCreatedEventSubscriber',
  );
  static readonly UserUpdatedEventSubscriber: unique symbol = Symbol(
    'UserUpdatedEventSubscriber',
  );

  //Repository
  static readonly UserChatRepository: unique symbol =
    Symbol('UserChatRepository');

  //Controller
  static readonly UserChatController: unique symbol =
    Symbol('UserChatController');
}
