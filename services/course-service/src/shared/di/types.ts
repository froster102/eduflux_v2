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
  GetCourseAssetsUploadUrlUseCase: Symbol.for(
    'GetCourseAssetsUploadUrlUseCase',
  ),
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

  //Ports
  UserServiceGateway: Symbol.for('UserServiceGateway'),
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

  //Mappers
  CourseMapper: Symbol.for('CourseMapper'),
  ChapterMapper: Symbol.for('SectionMapper'),
  LectureMapper: Symbol.for('LessonMapper'),
  AssetMapper: Symbol.for('AssetMapper'),
  CategoryMapper: Symbol.for('CategoryMapper'),
};
