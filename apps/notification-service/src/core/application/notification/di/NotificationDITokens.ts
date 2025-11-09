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

  //Subscribers
  static readonly EnrollmentCreatedEventSubscriber: unique symbol = Symbol(
    'EnrollmentCreatedEventSubscriber',
  );
  static readonly SessionConfirmedEventSubscriber: unique symbol = Symbol(
    'SessionConfirmedEventSubscriber',
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
