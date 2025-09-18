export class NotificationDITokens {
  //use-cases
  static readonly CreateNotificationUseCase: unique symbol = Symbol(
    "CreateNotificationUseCase",
  );
  static readonly MarkNotificationAsSeenUseCase: unique symbol = Symbol(
    "MarkNotificationAsSeenUseCase",
  );
  static readonly GetNotificationsUseCase: unique symbol = Symbol(
    "GetNotificationsUseCase",
  );

  //handler
  static readonly EnrollmentEventHandler: unique symbol = Symbol(
    "EnrollmentEventHandler",
  );

  //respository
  static readonly NotificationRepository: unique symbol = Symbol(
    "NotificationRepository",
  );

  //Controller
  static readonly NotificationController: unique symbol = Symbol(
    "NotificationController",
  );
}
