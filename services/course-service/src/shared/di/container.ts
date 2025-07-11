import { CreateCourseUseCase } from '@/application/use-cases/create-course.use-case';
import { Container } from 'inversify';
import { TYPES } from './types';
import { IUserServiceGateway } from '@/application/ports/user-service.gateway';
import { GrpcUserServiceClient } from '@/infrastructure/grpc/client/user-service-client.grpc';
import { ICourseRepository } from '@/domain/repositories/course.repository';
import { MongoCourseRepository } from '@/infrastructure/database/repositories/course.repository';
import { IMapper } from '@/infrastructure/mappers/mapper.interface';
import { CourseMapper } from '@/infrastructure/mappers/course.mapper';
import { Course } from '@/domain/entity/course.entity';
import { ICourse } from '@/infrastructure/database/schema/course.schema';
import { DatabaseClient } from '@/infrastructure/database/setup';
import { UpdateCourseUseCase } from '@/application/use-cases/update-course.use-case';
import { ApproveCourseUseCase } from '@/application/use-cases/approve-course.use-case';
import { RejectCourseUseCase } from '@/application/use-cases/reject-course.use-case';
import { SubmitForReviewUseCase } from '@/application/use-cases/submit-for-review.use-case';
import { GetInstructorCourseCurriculumUseCase } from '@/application/use-cases/get-instructor-course-curriculum.use-case';
import { PublishCourseUseCase } from '@/application/use-cases/publish-course.use-case';
import { IFileStorageGateway } from '@/application/ports/file-storage.gateway';
import { CloudinaryService } from '@/infrastructure/storage/cloudinary.service';
import { Asset } from '@/domain/entity/asset.entity';
import { IAsset } from '@/infrastructure/database/schema/asset.schema';
import { AssetMapper } from '@/infrastructure/mappers/asset.mapper';
import { IAssetRepository } from '@/domain/repositories/asset.repository';
import { MongoAssetRepository } from '@/infrastructure/database/repositories/asset.repository';
import { CompleteAssetUploadUseCase } from '@/application/use-cases/complete-asset-upload.use-case';
import { AdminRoutes } from '@/interface/routes/admin.route';
import { LearnerRoutes } from '@/interface/routes/learner.routes';
import { InstructorRoutes } from '@/interface/routes/instructor.routes';
import { CreateChapterUseCase } from '@/application/use-cases/create-chapter.use-case';
import { DeleteChapterUseCase } from '@/application/use-cases/delete-chapter.use-case';
import { UpdateChapterUseCase } from '@/application/use-cases/update-chapter.use-case';
import { CreateLectureUseCase } from '@/application/use-cases/create-lecture.use-case';
import { UpdateLectureUseCase } from '@/application/use-cases/update-lecture.use-case';
import { DeleteLectureUseCase } from '@/application/use-cases/delete-lecture.use-case';
import { AddAssetToLectureUseCase } from '@/application/use-cases/add-asset-to-lecture.use-case';
import { IChapter } from '@/infrastructure/database/schema/chapter.schema';
import { ChapterMapper } from '@/infrastructure/mappers/chapter.mapper';
import { Chapter } from '@/domain/entity/chapter.entity';
import { Lecture } from '@/domain/entity/lecture.entity';
import { ILecture } from '@/infrastructure/database/schema/lecture.schema';
import { LectureMapper } from '@/infrastructure/mappers/lecture.mapper';
import { IChapterRepository } from '@/domain/repositories/chapter.repository';
import { MongoChapterRepository } from '@/infrastructure/database/repositories/chapter.repository';
import { ILectureRepository } from '@/domain/repositories/lecture.repository';
import { MongoLectureRepository } from '@/infrastructure/database/repositories/lecture.repository';
import { GetAllInstructorCoursesUseCase } from '@/application/use-cases/get-all-instructor-course.use-case';
import { ReorderCurriculumUseCase } from '@/application/use-cases/reorder-curriculum.use-case';
import { Category } from '@/domain/entity/category.entity';
import { ICategory } from '@/infrastructure/database/schema/category.schema';
import { CategoryMapper } from '@/infrastructure/mappers/category.mapper';
import { ICategoryRepository } from '@/domain/repositories/category.repository';
import { MongoCategoryRepository } from '@/infrastructure/database/repositories/category.repository';
import { GetCourseCategoriesUseCase } from '@/application/use-cases/get-course-categories.use-case';
import { CourseRoutes } from '@/interface/routes/course.routes';
import { GetInstructorCourseUseCase } from '@/application/use-cases/get-instructor-course.use-case';
import { GetPublishedCoursesUseCase } from '@/application/use-cases/get-published-courses.use-case';
import { GetPublishedCourseInfoUseCase } from '@/application/use-cases/get-published-course-info.use-case';
import { GetPublishedCourseCurriculumUseCase } from '@/application/use-cases/get-published-course-curriculum';
import { GrpcCourseService } from '@/infrastructure/grpc/services/course.service';

const container = new Container();

//database
container.bind<DatabaseClient>(TYPES.DatabaseClient).to(DatabaseClient);

//Use cases
container
  .bind<CreateCourseUseCase>(TYPES.CreateCourseUseCase)
  .to(CreateCourseUseCase);
container
  .bind<UpdateCourseUseCase>(TYPES.UpdateCourseUseCase)
  .to(UpdateCourseUseCase);
container
  .bind<ApproveCourseUseCase>(TYPES.ApproveCourseUseCase)
  .to(ApproveCourseUseCase);
container
  .bind<RejectCourseUseCase>(TYPES.RejectCourseUseCase)
  .to(RejectCourseUseCase);
container
  .bind<SubmitForReviewUseCase>(TYPES.SubmitForReviewUseCase)
  .to(SubmitForReviewUseCase);
container
  .bind<GetInstructorCourseCurriculumUseCase>(
    TYPES.GetInstructorCourseCurriculumUseCase,
  )
  .to(GetInstructorCourseCurriculumUseCase);
container
  .bind<CreateChapterUseCase>(TYPES.CreateChapterUseCase)
  .to(CreateChapterUseCase);
container
  .bind<DeleteChapterUseCase>(TYPES.DeleteChapterUseCase)
  .to(DeleteChapterUseCase);
container
  .bind<UpdateChapterUseCase>(TYPES.UpdateChapterUseCase)
  .to(UpdateChapterUseCase);
container
  .bind<CreateLectureUseCase>(TYPES.CreateLectureUseCase)
  .to(CreateLectureUseCase);
container
  .bind<UpdateLectureUseCase>(TYPES.UpdateLectureUseCase)
  .to(UpdateLectureUseCase);
container
  .bind<DeleteLectureUseCase>(TYPES.DeleteLectureUseCase)
  .to(DeleteLectureUseCase);
container
  .bind<PublishCourseUseCase>(TYPES.PublishCourseUseCase)
  .to(PublishCourseUseCase);
container
  .bind<CompleteAssetUploadUseCase>(TYPES.CompleteAssetUploadUseCase)
  .to(CompleteAssetUploadUseCase);
container
  .bind<AddAssetToLectureUseCase>(TYPES.AddAssetToLectureUseCase)
  .to(AddAssetToLectureUseCase);
container
  .bind<GetAllInstructorCoursesUseCase>(TYPES.GetAllInstructorCoursesUseCase)
  .to(GetAllInstructorCoursesUseCase);
container
  .bind<ReorderCurriculumUseCase>(TYPES.ReorderCurriculumUseCase)
  .to(ReorderCurriculumUseCase);
container
  .bind<GetCourseCategoriesUseCase>(TYPES.GetCourseCategoriesUseCase)
  .to(GetCourseCategoriesUseCase);
container
  .bind<GetInstructorCourseUseCase>(TYPES.GetInstructorCourseUseCase)
  .to(GetInstructorCourseUseCase);
container
  .bind<GetPublishedCoursesUseCase>(TYPES.GetPublishedCoursesUseCase)
  .to(GetPublishedCoursesUseCase);
container
  .bind<GetPublishedCourseInfoUseCase>(TYPES.GetPublishedCourseInfoUseCase)
  .to(GetPublishedCourseInfoUseCase);
container
  .bind<GetPublishedCourseCurriculumUseCase>(
    TYPES.GetPublishedCourseCurriculumUseCase,
  )
  .to(GetPublishedCourseCurriculumUseCase);

//Http Routes
container.bind<AdminRoutes>(TYPES.AdminRoutes).to(AdminRoutes);
container.bind<LearnerRoutes>(TYPES.LearnerRoutes).to(LearnerRoutes);
container.bind<InstructorRoutes>(TYPES.InstructorRoutes).to(InstructorRoutes);
container.bind<CourseRoutes>(TYPES.CourseRoutes).to(CourseRoutes);

//Grpc Service
container
  .bind<GrpcCourseService>(TYPES.GrpcCourseService)
  .to(GrpcCourseService);

//Ports
container
  .bind<IUserServiceGateway>(TYPES.UserServiceGateway)
  .to(GrpcUserServiceClient);
container
  .bind<IFileStorageGateway>(TYPES.FileStorageGateway)
  .to(CloudinaryService);

//Repositories
container
  .bind<ICourseRepository>(TYPES.CourseRepository)
  .to(MongoCourseRepository);
container
  .bind<IAssetRepository>(TYPES.AssetRepository)
  .to(MongoAssetRepository);
container
  .bind<IChapterRepository>(TYPES.ChapterRepository)
  .to(MongoChapterRepository);
container
  .bind<ILectureRepository>(TYPES.LectureRepository)
  .to(MongoLectureRepository);
container
  .bind<ICategoryRepository>(TYPES.CategoryRepository)
  .to(MongoCategoryRepository);

//mappers
container
  .bind<IMapper<Course, ICourse>>(TYPES.CourseMapper)
  .to(CourseMapper)
  .inSingletonScope();
container
  .bind<IMapper<Chapter, IChapter>>(TYPES.ChapterMapper)
  .to(ChapterMapper)
  .inSingletonScope();
container
  .bind<IMapper<Lecture, ILecture>>(TYPES.LectureMapper)
  .to(LectureMapper)
  .inSingletonScope();
container
  .bind<IMapper<Asset, IAsset>>(TYPES.AssetMapper)
  .to(AssetMapper)
  .inSingletonScope();
container
  .bind<IMapper<Category, ICategory>>(TYPES.CategoryMapper)
  .to(CategoryMapper)
  .inSingletonScope();

export { container };
