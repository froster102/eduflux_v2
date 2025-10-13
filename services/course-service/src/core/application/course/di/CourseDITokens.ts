export class CourseDITokens {
  // Use cases
  static readonly CreateCourseUseCase: unique symbol = Symbol(
    'CreateCourseUseCase',
  );
  static readonly UpdateCourseUseCase: unique symbol = Symbol(
    'UpdateCourseUseCase',
  );
  static readonly ApproveCourseUseCase: unique symbol = Symbol(
    'ApproveCourseUseCase',
  );
  static readonly RejectCourseUseCase: unique symbol = Symbol(
    'RejectCourseUseCase',
  );
  static readonly SubmitForReviewUseCase: unique symbol = Symbol(
    'SubmitForReviewUseCase',
  );
  static readonly PublishCourseUseCase: unique symbol = Symbol(
    'PublishCourseUseCase',
  );
  static readonly GetCourseUseCase: unique symbol = Symbol('GetCourseUseCase');
  static readonly GetCourseCurriculumUseCase: unique symbol = Symbol(
    'GetCourseCurriculumUseCase',
  );
  static readonly GetAllInstructorCoursesUseCase: unique symbol = Symbol(
    'GetAllInstructorCoursesUseCase',
  );
  static readonly GetPublishedCoursesUseCase: unique symbol = Symbol(
    'GetPublishedCoursesUseCase',
  );
  static readonly GetCourseCategoriesUseCase: unique symbol = Symbol(
    'GetCourseCategoriesUseCase',
  );
  static readonly SetCoursePricingUseCase: unique symbol = Symbol(
    'SetCoursePricingUseCase',
  );
  static readonly ReorderCurriculumUseCase: unique symbol = Symbol(
    'ReorderCurriculumUseCase',
  );

  //handlers
  static readonly EnrollmentSuccessEventHandler: unique symbol = Symbol(
    'EnrollmentSuccessEventHandler',
  );

  // External Services
  static readonly UserServiceGateway: unique symbol =
    Symbol('UserServiceGateway');
  static readonly EnrollmentServiceGateway: unique symbol = Symbol(
    'EnrollmentServiceGateway',
  );
  static readonly FileStorageGateway: unique symbol =
    Symbol('FileStorageGateway');

  // Repository
  static readonly CourseRepository: unique symbol = Symbol('CourseRepository');
  static readonly CategoryRepository: unique symbol =
    Symbol('CategoryRepository');

  // Controller
  static readonly CourseController: unique symbol = Symbol('CourseController');
  static readonly GrpcCourseServiceController: unique symbol = Symbol(
    'GrpcCourseServiceController',
  );
}
