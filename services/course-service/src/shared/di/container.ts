import { CreateCourseUseCase } from '@/application/use-cases/create-course.use-case';
import { Container } from 'inversify';
import { TYPES } from './types';
import { GrpcUserServiceClient } from '@/infrastructure/grpc/client/user-service-client.grpc';
import { MongoCourseRepository } from '@/infrastructure/database/repositories/course.repository';
import { CourseMapper } from '@/infrastructure/mappers/course.mapper';
import { DatabaseClient } from '@/infrastructure/database/setup';
import { UpdateCourseUseCase } from '@/application/use-cases/update-course.use-case';
import { ApproveCourseUseCase } from '@/application/use-cases/approve-course.use-case';
import { RejectCourseUseCase } from '@/application/use-cases/reject-course.use-case';
import { SubmitForReviewUseCase } from '@/application/use-cases/submit-for-review.use-case';
import { GetInstructorCourseCurriculumUseCase } from '@/application/use-cases/get-instructor-course-curriculum.use-case';
import { PublishCourseUseCase } from '@/application/use-cases/publish-course.use-case.use-case';
import { CloudinaryService } from '@/infrastructure/storage/cloudinary.service';
import { AssetMapper } from '@/infrastructure/mappers/asset.mapper';
import { MongoAssetRepository } from '@/infrastructure/database/repositories/asset.repository';
import { CompleteAssetUploadUseCase } from '@/application/use-cases/complete-asset-upload.use-case';
import { AdminRoutes } from '@/interface/routes/admin.route';
import { LearnerRoutes } from '@/interface/routes/learner.routes';
import { InstructorRoutes } from '@/interface/routes/course.routes';
import { CreateChapterUseCase } from '@/application/use-cases/create-chapter.use-case';
import { DeleteChapterUseCase } from '@/application/use-cases/delete-chapter.use-case';
import { UpdateChapterUseCase } from '@/application/use-cases/update-chapter.use-case';
import { CreateLectureUseCase } from '@/application/use-cases/create-lecture.use-case';
import { UpdateLectureUseCase } from '@/application/use-cases/update-lecture.use-case';
import { DeleteLectureUseCase } from '@/application/use-cases/delete-lecture.use-case';
import { AddAssetToLectureUseCase } from '@/application/use-cases/add-asset-to-lecture.use-case';
import { ChapterMapper } from '@/infrastructure/mappers/chapter.mapper';
import { LectureMapper } from '@/infrastructure/mappers/lecture.mapper';
import { MongoChapterRepository } from '@/infrastructure/database/repositories/chapter.repository';
import { MongoLectureRepository } from '@/infrastructure/database/repositories/lecture.repository';
import { GetAllInstructorCoursesUseCase } from '@/application/use-cases/get-all-instructor-course.use-case';
import { ReorderCurriculumUseCase } from '@/application/use-cases/reorder-curriculum.use-case';
import { CategoryMapper } from '@/infrastructure/mappers/category.mapper';
import { MongoCategoryRepository } from '@/infrastructure/database/repositories/category.repository';
import { GetCourseCategoriesUseCase } from '@/application/use-cases/get-course-categories.use-case';
import { CourseRoutes } from '@/interface/routes/user.routes';
import { GetInstructorCourseUseCase } from '@/application/use-cases/get-instructor-course.use-case';
import { GetPublishedCoursesUseCase } from '@/application/use-cases/get-published-courses.use-case';
import { GetPublishedCourseInfoUseCase } from '@/application/use-cases/get-published-course-info.use-case';
import { GetPublishedCourseCurriculumUseCase } from '@/application/use-cases/get-published-course-curriculum.use-case';
import { GrpcCourseService } from '@/infrastructure/grpc/services/course.grpc.service';
import { GetUserSubscribedCoursesUseCase } from '@/application/use-cases/get-user-subscribed-courses.use-case';
import { GrpcEnrollmentServiceClient } from '@/infrastructure/grpc/client/enrollment-service-client.grpc';
import { UpdateEnrollmentCountUseCase } from '@/application/use-cases/update-enrollment-count.use-case';
import { EnrollmentEventsConsumer } from '@/interface/consumer/enrollment-events.consumer';
import { GetSubscriberLectureUseCase } from '@/application/use-cases/get-subscriber-lecture.use-case';

const container = new Container();

//database
container.bind(TYPES.DatabaseClient).to(DatabaseClient);

//Use cases
container.bind(TYPES.CreateCourseUseCase).to(CreateCourseUseCase);
container.bind(TYPES.UpdateCourseUseCase).to(UpdateCourseUseCase);
container.bind(TYPES.ApproveCourseUseCase).to(ApproveCourseUseCase);
container.bind(TYPES.RejectCourseUseCase).to(RejectCourseUseCase);
container.bind(TYPES.SubmitForReviewUseCase).to(SubmitForReviewUseCase);
container
  .bind(TYPES.GetInstructorCourseCurriculumUseCase)
  .to(GetInstructorCourseCurriculumUseCase);
container.bind(TYPES.CreateChapterUseCase).to(CreateChapterUseCase);
container.bind(TYPES.DeleteChapterUseCase).to(DeleteChapterUseCase);
container.bind(TYPES.UpdateChapterUseCase).to(UpdateChapterUseCase);
container.bind(TYPES.CreateLectureUseCase).to(CreateLectureUseCase);
container.bind(TYPES.UpdateLectureUseCase).to(UpdateLectureUseCase);
container.bind(TYPES.DeleteLectureUseCase).to(DeleteLectureUseCase);
container.bind(TYPES.PublishCourseUseCase).to(PublishCourseUseCase);
container.bind(TYPES.CompleteAssetUploadUseCase).to(CompleteAssetUploadUseCase);
container.bind(TYPES.AddAssetToLectureUseCase).to(AddAssetToLectureUseCase);
container
  .bind(TYPES.GetAllInstructorCoursesUseCase)
  .to(GetAllInstructorCoursesUseCase);
container.bind(TYPES.ReorderCurriculumUseCase).to(ReorderCurriculumUseCase);
container.bind(TYPES.GetCourseCategoriesUseCase).to(GetCourseCategoriesUseCase);
container.bind(TYPES.GetInstructorCourseUseCase).to(GetInstructorCourseUseCase);
container.bind(TYPES.GetPublishedCoursesUseCase).to(GetPublishedCoursesUseCase);
container
  .bind(TYPES.GetPublishedCourseInfoUseCase)
  .to(GetPublishedCourseInfoUseCase);
container
  .bind(TYPES.GetPublishedCourseCurriculumUseCase)
  .to(GetPublishedCourseCurriculumUseCase);
container
  .bind(TYPES.GetUserSubscribedCoursesUseCase)
  .to(GetUserSubscribedCoursesUseCase);
container
  .bind(TYPES.UpdateCourseEnrollmentCountUseCase)
  .to(UpdateEnrollmentCountUseCase);

container
  .bind(TYPES.GetSubscriberLectureUseCase)
  .to(GetSubscriberLectureUseCase);

//Http Routes
container.bind(TYPES.AdminRoutes).to(AdminRoutes);
container.bind(TYPES.LearnerRoutes).to(LearnerRoutes);
container.bind(TYPES.InstructorRoutes).to(InstructorRoutes);
container.bind(TYPES.CourseRoutes).to(CourseRoutes);

//Grpc Service
container.bind(TYPES.GrpcCourseService).to(GrpcCourseService);

//Ports
container
  .bind(TYPES.UserServiceGateway)
  .to(GrpcUserServiceClient)
  .inSingletonScope();
container.bind(TYPES.FileStorageGateway).to(CloudinaryService);
container
  .bind(TYPES.EnrollmentServiceGateway)
  .to(GrpcEnrollmentServiceClient)
  .inSingletonScope();

//Repositories
container.bind(TYPES.CourseRepository).to(MongoCourseRepository);
container.bind(TYPES.AssetRepository).to(MongoAssetRepository);
container.bind(TYPES.ChapterRepository).to(MongoChapterRepository);
container.bind(TYPES.LectureRepository).to(MongoLectureRepository);
container.bind(TYPES.CategoryRepository).to(MongoCategoryRepository);

//Consumer
container.bind(TYPES.EnrollmentEventsConsumer).to(EnrollmentEventsConsumer);

//mappers
container.bind(TYPES.CourseMapper).to(CourseMapper).inSingletonScope();
container.bind(TYPES.ChapterMapper).to(ChapterMapper).inSingletonScope();
container.bind(TYPES.LectureMapper).to(LectureMapper).inSingletonScope();
container.bind(TYPES.AssetMapper).to(AssetMapper).inSingletonScope();
container.bind(TYPES.CategoryMapper).to(CategoryMapper).inSingletonScope();

export { container };
