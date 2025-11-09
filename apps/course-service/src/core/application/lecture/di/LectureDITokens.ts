export class LectureDITokens {
  // Use cases
  static readonly CreateLectureUseCase: unique symbol = Symbol(
    'CreateLectureUseCase',
  );
  static readonly UpdateLectureUseCase: unique symbol = Symbol(
    'UpdateLectureUseCase',
  );
  static readonly DeleteLectureUseCase: unique symbol = Symbol(
    'DeleteLectureUseCase',
  );
  static readonly GetLectureUseCase: unique symbol =
    Symbol('GetLectureUseCase');
  static readonly GetCourseLecturesUseCase: unique symbol = Symbol(
    'GetCourseLecturesUseCase',
  );
  static readonly GetSubscriberLectureUseCase: unique symbol = Symbol(
    'GetSubscriberLectureUseCase',
  );
  static readonly ReorderLecturesUseCase: unique symbol = Symbol(
    'ReorderLecturesUseCase',
  );

  // External Services
  static readonly EnrollmentServiceGateway: unique symbol = Symbol(
    'EnrollmentServiceGateway',
  );

  // Repository
  static readonly LectureRepository: unique symbol =
    Symbol('LectureRepository');

  // Controller
  static readonly LectureController: unique symbol =
    Symbol('LectureController');
}
