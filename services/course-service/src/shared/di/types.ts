export const TYPES = {
  //Database
  DatabaseClient: Symbol.for('DatabaseClient'),

  //Use case
  CreateCourseUseCase: Symbol.for('CreateCourseUseCase'),
  UpdateCourseUseCase: Symbol.for('UpdateCourseUseCase'),
  ApproveCourseUseCase: Symbol.for('ApproveCourseUseCase'),
  RejectCourseUseCase: Symbol.for('RejectCourseUseCase'),
  SubmitForReviewUseCase: Symbol.for('SubmitForReviewUseCase'),
  GetInstructorCourseCurriculumUseCase: Symbol.for('GetCourseByIdUseCase'),
  UpdatePriceTierUseCase: Symbol.for('UpdatePriceTierUseCase'),
  CreateChapterUseCase: Symbol.for('CreateChapterUseCase'),
  DeleteChapterUseCase: Symbol.for('DeleteSectionUseCase'),
  UpdateChapterUseCase: Symbol.for('UpdateSectionUseCase'),
  CreateLectureUseCase: Symbol.for('AddLessonUseCase'),
  UpdateLectureUseCase: Symbol.for('UpdateLessonUseCase'),
  DeleteLectureUseCase: Symbol.for('DeleteLessonUseCase'),
  PublishCourseUseCase: Symbol.for('PublishCourseUseCase'),
  CompleteAssetUploadUseCase: Symbol.for('CompleteAssetUploadUseCase'),
  AddAssetToLectureUseCase: Symbol.for('AddAssetToLessonUseCase'),
  GetAllInstructorCoursesUseCase: Symbol.for('GetAllInstructorCoursesUseCase'),
  ReorderCurriculumUseCase: Symbol.for('ReorderCurriculumUseCase'),
  GetCourseCategoriesUseCase: Symbol.for('GetCourseCategoriesUseCase'),
  GetInstructorCourseUseCase: Symbol.for('GetInstructorCourseUseCase'),
  GetPublishedCoursesUseCase: Symbol.for('GetAllPublishedCoursesUseCase'),
  GetPublishedCourseInfoUseCase: Symbol.for('GetPublishedCourseInfoUseCase'),
  GetPublishedCourseCurriculumUseCase: Symbol.for(
    'GetPublishedCourseCurriculumUseCase',
  ),
  GetUserSubscribedCoursesUseCase: Symbol.for(
    'GetUserSubscribedCoursesUseCase',
  ),
  UpdateCourseEnrollmentCountUseCase: Symbol.for(
    'UpdateCourseEnrollmentCountUseCase',
  ),
  GetSubscriberLectureUseCase: Symbol.for('GetSubscriberLectureUseCase'),

  //Ports
  UserServiceGateway: Symbol.for('UserServiceGateway'),
  EnrollmentServiceGateway: Symbol.for('EnrollmentServiceGateway'),
  FileStorageGateway: Symbol.for('FileStorageGateway'),

  //Repositories
  CourseRepository: Symbol.for('CourseRepository'),
  AssetRepository: Symbol.for('AssetRepository'),
  ChapterRepository: Symbol.for('ChapterRepository'),
  LectureRepository: Symbol.for('LectureRepository'),
  CategoryRepository: Symbol.for('CategoryRepository'),

  //Http Routes
  AdminRoutes: Symbol.for('AdminRoutes'),
  InstructorRoutes: Symbol.for('InstructorRoutes'),
  LearnerRoutes: Symbol.for('LearnerRoutes'),
  CourseRoutes: Symbol.for('CourseRoutes'),

  //Consumers
  EnrollmentEventsConsumer: Symbol.for('EnrollmentEventsConsumer'),

  //Grpc Services
  GrpcCourseService: Symbol.for('GrpcCourseService'),

  //Logger
  Logger: Symbol.for('Logger'),

  //Mappers
  CourseMapper: Symbol.for('CourseMapper'),
  ChapterMapper: Symbol.for('SectionMapper'),
  LectureMapper: Symbol.for('LessonMapper'),
  AssetMapper: Symbol.for('AssetMapper'),
  CategoryMapper: Symbol.for('CategoryMapper'),
};
