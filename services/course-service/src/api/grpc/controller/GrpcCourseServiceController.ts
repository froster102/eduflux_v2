import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { GetCourseUseCase } from '@core/application/course/usecase/GetCourseUseCase';
import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { GetEnrollmentUseCase } from '@core/application/enrollment/usecase/GetEnrollmentUseCase';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { Exception } from '@core/common/exception/Exception';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import {
  status,
  type sendUnaryData,
  type ServerUnaryCall,
} from '@grpc/grpc-js';
import type {
  Course,
  CourseServiceServer,
  Enrollment,
  GetCourseDetailsRequest,
  GetEnrollmentRequest,
} from '@infrastructure/adapter/grpc/generated/course';
import { getGrpcStatusCode } from '@shared/errors/error-code';
import { inject } from 'inversify';

export class GrpcCourseServiceController implements CourseServiceServer {
  private logger: LoggerPort;

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall | any;

  constructor(
    @inject(CoreDITokens.Logger) logger: LoggerPort,
    @inject(CourseDITokens.GetCourseUseCase)
    private readonly getCourseUseCase: GetCourseUseCase,
    @inject(EnrollmentDITokens.GetEnrollmentUseCase)
    private readonly getEnrollmentUseCase: GetEnrollmentUseCase,
  ) {
    this.logger = logger.fromContext(GrpcCourseServiceController.name);
  }

  getCourseDetails(
    call: ServerUnaryCall<GetCourseDetailsRequest, Course>,
    callback: sendUnaryData<Course>,
  ): void {
    this.getCourseUseCase
      .execute({ courseId: call.request.courseId })
      .then((course) => {
        const response: Course = {
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail!,
          level: course.level!,
          categoryId: course.categoryId,
          price: course.price!,
          isFree: course.isFree,
          status: course.status,
          instructor: course.instructor,
          averageRating: course.averageRating,
          ratingCount: course.ratingCount,
          enrollmentCount: course.enrollmentCount,
          createdAt: course.createdAt.toISOString(),
          updatedAt: course.updatedAt.toISOString(),
          publishedAt: course.updatedAt.toISOString(),
        };
        callback(null, response);
      })
      .catch((error: Error) => {
        this.logger.error(`Error processing request: ${error.message}`);
        this.handleError(error, callback);
      });
  }

  getEnrollment(
    call: ServerUnaryCall<GetEnrollmentRequest, Enrollment>,
    callback: sendUnaryData<Enrollment>,
  ): void {
    this.getEnrollmentUseCase
      .execute({ enrollmentId: call.request.enrollmentId })
      .then((enrollment) => {
        const response: Enrollment = {
          id: enrollment.id,
          learnerId: enrollment.learnerId,
          courseId: enrollment.courseId,
          status: enrollment.status,
          instructorId: enrollment.instructorId,
          paymentId: enrollment.paymentId ?? '',
          createdAt: enrollment.createdAt.toISOString(),
          updatedAt: enrollment.updatedAt.toISOString(),
        };
        callback(null, response);
      })
      .catch((error: Error) => {
        this.logger.error(`Error processing request: ${error.message}`);
        this.handleError(error, callback);
      });
  }

  private handleError<T>(error: Error, callback: sendUnaryData<T>) {
    if (error instanceof Exception) {
      const serviceError = {
        name: error.name,
        code: getGrpcStatusCode(error.code),
        message: error.message,
      };
      callback(serviceError, null);
    }
    const serviceError = {
      name: error.name,
      code: status.INTERNAL,
      message: 'Failed to process request',
    };
    callback(serviceError, null);
  }
}
