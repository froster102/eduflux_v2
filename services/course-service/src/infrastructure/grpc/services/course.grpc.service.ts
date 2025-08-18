import {
  Course,
  type CourseServiceServer,
  GetCourseDetailsRequest,
} from '../generated/course';
import {
  type sendUnaryData,
  type ServerUnaryCall,
  status,
} from '@grpc/grpc-js';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { getGrpcStatusCode } from '@/shared/errors/error-code';
import { ApplicationException } from '@/application/exceptions/application.exception';
import { DomainException } from '@/domain/exceptions/domain.exception';
import type { IGetPublishedCourseInfoUseCase } from '@/application/use-cases/interface/get-published-course-info.interface';
import { container } from '@/shared/di/container';
import type { ILogger } from '@/shared/common/interfaces/logger.interface';

export class GrpcCourseService implements CourseServiceServer {
  private logger = container.get<ILogger>(TYPES.Logger);

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall | any;

  constructor(
    @inject(TYPES.GetPublishedCourseInfoUseCase)
    private readonly getPublishedCourseInfoUseCase: IGetPublishedCourseInfoUseCase,
  ) {}

  getCourseDetails(
    call: ServerUnaryCall<GetCourseDetailsRequest, Course>,
    callback: sendUnaryData<Course>,
  ): void {
    this.logger.info(
      `Received request for course with ID:${call.request.courseId}`,
    );
    this.getPublishedCourseInfoUseCase
      .execute(call.request.courseId)
      .then((course) => {
        const response: Course = {
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail,
          level: course.level,
          categoryId: course.categoryId,
          price: course.price,
          isFree: course.isFree,
          status: course.status,
          instructor: course.instructor,
          averageRating: course.averageRating,
          ratingCount: course.ratingCount,
          enrollmentCount: course.enrollmentCount,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
          publishedAt: course.updatedAt,
        };
        callback(null, response);
      })
      .catch((error: Error) => {
        this.logger.error(`Error processing request: ${error.message}`);
        if (
          error instanceof ApplicationException ||
          error instanceof DomainException
        ) {
          const serviceError = {
            name: 'CourseServiceError',
            code: getGrpcStatusCode(error.code),
            message: error.message,
          };
          callback(serviceError, null);
        } else {
          const serviceError = {
            name: 'CourseServiceError',
            code: status.INTERNAL,
            message: 'Failed to process request to create user profile',
          };
          callback(serviceError, null);
        }
      });
  }
}
