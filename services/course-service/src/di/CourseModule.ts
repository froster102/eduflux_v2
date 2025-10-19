import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import { CreateCourseService } from '@core/application/course/service/usecase/CreateCourseService';
import { UpdateCourseService } from '@core/application/course/service/usecase/UpdateCourseService';
import { GetAllInstructorCoursesService } from '@core/application/course/service/usecase/GetAllInstructorCoursesService';
import { GetPublishedCoursesService } from '@core/application/course/service/usecase/GetPublishedCoursesService';
import { GetCourseCategoriesService } from '@core/application/course/service/usecase/GetCourseCategoriesService';
import type { CreateCourseUseCase } from '@core/application/course/usecase/CreateCourseUseCase';
import type { UpdateCourseUseCase } from '@core/application/course/usecase/UpdateCourseUseCase';
import type { GetAllInstructorCoursesUseCase } from '@core/application/course/usecase/GetAllInstructorCoursesUseCase';
import type { GetPublishedCoursesUseCase } from '@core/application/course/usecase/GetPublishedCoursesUseCase';
import type { GetCourseCategoriesUseCase } from '@core/application/course/usecase/GetCourseCategoriesUseCase';
import { CourseController } from '@api/http/controller/CourseController';
import { ContainerModule } from 'inversify';
import type { GetCourseUseCase } from '@core/application/course/usecase/GetCourseUseCase';
import { GetCourseService } from '@core/application/course/service/usecase/GetCourseService';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import { MongooseCourseRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/course/MongooseCourseRepositoryAdapter';
import type { ApproveCourseUseCase } from '@core/application/course/usecase/ApproveCourseUseCase';
import { ApproveCourseService } from '@core/application/course/service/usecase/ApproveCourseService';
import type { GetCourseCurriculumUseCase } from '@core/application/course/usecase/GetCourseCurriculumUseCase';
import { GetCourseCurriculumService } from '@core/application/course/service/usecase/GetCourseCurriculumService';
import type { PublishCourseUseCase } from '@core/application/course/usecase/PublishCourseUseCase';
import { PublishCourseService } from '@core/application/course/service/usecase/PublishCourseService';
import type { RejectCourseUseCase } from '@core/application/course/usecase/RejectCourseUseCase';
import { RejectCourseService } from '@core/application/course/service/usecase/RejectCourseService';
import type { ReorderCurriculumUseCase } from '@core/application/course/usecase/ReorderCurriculumUseCase';
import { ReorderCurriculumService } from '@core/application/course/service/usecase/ReorderCurriculumService';
import type { SubmitCourseForReviewUseCase } from '@core/application/course/usecase/SubmitCourseForReviewUseCase';
import { SubmitCourseForReviewService } from '@core/application/course/service/usecase/SubmitForReviewService';
import { GrpcCourseServiceController } from '@api/grpc/controller/GrpcCourseServiceController';

export const CourseModule: ContainerModule = new ContainerModule((options) => {
  // Use cases
  options
    .bind<CreateCourseUseCase>(CourseDITokens.CreateCourseUseCase)
    .to(CreateCourseService);
  options
    .bind<UpdateCourseUseCase>(CourseDITokens.UpdateCourseUseCase)
    .to(UpdateCourseService);
  options
    .bind<ApproveCourseUseCase>(CourseDITokens.ApproveCourseUseCase)
    .to(ApproveCourseService);
  options
    .bind<GetAllInstructorCoursesUseCase>(
      CourseDITokens.GetAllInstructorCoursesUseCase,
    )
    .to(GetAllInstructorCoursesService);
  options
    .bind<GetCourseCategoriesUseCase>(CourseDITokens.GetCourseCategoriesUseCase)
    .to(GetCourseCategoriesService);
  options
    .bind<GetCourseCurriculumUseCase>(CourseDITokens.GetCourseCurriculumUseCase)
    .to(GetCourseCurriculumService);
  options
    .bind<GetCourseUseCase>(CourseDITokens.GetCourseUseCase)
    .to(GetCourseService);
  // options
  //   .bind<GetInstructorCourseUseCase>(CourseDITokens.GetInstructorCourseUseCase)
  //   .to(GetInstructorCourseService);
  options
    .bind<PublishCourseUseCase>(CourseDITokens.PublishCourseUseCase)
    .to(PublishCourseService);
  options
    .bind<RejectCourseUseCase>(CourseDITokens.RejectCourseUseCase)
    .to(RejectCourseService);
  options
    .bind<ReorderCurriculumUseCase>(CourseDITokens.ReorderCurriculumUseCase)
    .to(ReorderCurriculumService);
  // options.bind<SetCoursePricingUseCase>(CourseDITokens.SetCoursePricingUseCase).to(SetCourse)
  options
    .bind<SubmitCourseForReviewUseCase>(CourseDITokens.SubmitForReviewUseCase)
    .to(SubmitCourseForReviewService);
  options
    .bind<GetPublishedCoursesUseCase>(CourseDITokens.GetPublishedCoursesUseCase)
    .to(GetPublishedCoursesService);
  // options
  //   .bind<SetCoursePricingUseCase>(CourseDITokens.SetCoursePricingUseCase)
  //   .to({});

  // Controller
  options
    .bind<CourseController>(CourseDITokens.CourseController)
    .to(CourseController);

  //Grpc controller
  options
    .bind<GrpcCourseServiceController>(
      CourseDITokens.GrpcCourseServiceController,
    )
    .to(GrpcCourseServiceController)
    .inSingletonScope();

  // Repository
  options
    .bind<CourseRepositoryPort>(CourseDITokens.CourseRepository)
    .to(MongooseCourseRepositoryAdapter);
});
