export class NotificationDITokens {
  //use-cases
  static readonly CreateNotificationUseCase: unique symbol = Symbol(
    'CreateNotificationUseCase',
  );
  static readonly MarkNotificationAsSeenUseCase: unique symbol = Symbol(
    'MarkNotificationAsSeenUseCase',
  );
  static readonly GetNotificationsUseCase: unique symbol = Symbol(
    'GetNotificationsUseCase',
  );

  //handler
  static readonly EnrollmentCompletedEventHandler: unique symbol = Symbol(
    'EnrollmentCompletedEventHandler',
  );
  static readonly SessionConfirmedEventHandler: unique symbol = Symbol(
    'SessionConfirmedEventHandler',
  );

  //respository
  static readonly NotificationRepository: unique symbol = Symbol(
    'NotificationRepository',
  );

  //External services
  static readonly TemplateService: unique symbol = Symbol('TemplateService');
  static readonly EmailService: unique symbol = Symbol('EmailService');

  //Controller
  static readonly NotificationController: unique symbol = Symbol(
    'NotificationController',
  );
}
