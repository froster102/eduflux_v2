export class CoreDITokens {
  static readonly Logger: unique symbol = Symbol('Logger');

  static readonly TemplateService: unique symbol = Symbol('TemplateService');

  //external service
  static readonly CourseService: unique symbol = Symbol('CourseService');
  static readonly EmailService: unique symbol = Symbol('EmailService');
  static readonly UserService: unique symbol = Symbol('UserService');
}
