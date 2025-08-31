import type {
  CheckUserEnrollmentRequest,
  CheckUserEnrollmentResponse,
  Enrollments,
  EnrollmentServiceServer,
  GetUserEnrollmentsRequest,
  VerifyChatAccessRequest,
  VerifyChatAccessResponse,
} from '@api/grpc/generated/enrollment';
import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { CheckUserEnrollmentUseCase } from '@core/application/enrollment/usecase/CheckUserEnrollmentUseCase';
import type { GetUserEnrollmentsUseCase } from '@core/application/enrollment/usecase/GetUserEnrollmentsUseCase';
import type { VerifyChatAccessUseCase } from '@core/application/enrollment/usecase/VerifyChatAccessUseCase';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { Exception } from '@core/common/exception/Exception';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import {
  status,
  type sendUnaryData,
  type ServerUnaryCall,
} from '@grpc/grpc-js';
import { getGrpcStatusCode } from '@shared/errors/error-code';
import { inject } from 'inversify';

export class GrpcEnrollmentServiceController
  implements EnrollmentServiceServer
{
  constructor(
    @inject(EnrollmentDITokens.CheckUserEnrollmentUseCase)
    private readonly checkUserEnrollmenntUseCase: CheckUserEnrollmentUseCase,
    @inject(EnrollmentDITokens.GetUserEnrollmentsUseCase)
    private readonly getUserEnrollmentsUseCase: GetUserEnrollmentsUseCase,
    @inject(EnrollmentDITokens.VerifyChatAccessUseCase)
    private readonly verifyChatAccessUseCase: VerifyChatAccessUseCase,
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
  ) {
    this.logger = logger.fromContext(GrpcEnrollmentServiceController.name);
  }

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [name: string]: import('@grpc/grpc-js').UntypedHandleCall | any;

  checkUserEnrollment(
    call: ServerUnaryCall<
      CheckUserEnrollmentRequest,
      CheckUserEnrollmentResponse
    >,
    callback: sendUnaryData<CheckUserEnrollmentResponse>,
  ): void {
    this.logger.info(
      `Recevied request for user enrollment check for user with ID:${call.request.userId}`,
    );
    this.checkUserEnrollmenntUseCase
      .execute({
        userId: call.request.userId,
        courseId: call.request.courseId,
      })
      .then((enrollmentStatus) => {
        callback(null, enrollmentStatus);
      })
      .catch((error: Error) => {
        this.handleError(error, callback);
      });
  }

  getUserEnrollments(
    call: ServerUnaryCall<GetUserEnrollmentsRequest, Enrollments>,
    callback: sendUnaryData<Enrollments>,
  ) {
    this.logger.info(
      `Received request to getting user enrollments for user with ID:${call.request.userId}`,
    );
    this.getUserEnrollmentsUseCase
      .execute({
        userId: call.request.userId,
        queryParameters: {
          ...call.request.pagination,
        },
      })
      .then((result) => {
        callback(null, {
          enrollments: result.enrollments.map((enrollment) => ({
            ...enrollment,
            paymentId: enrollment.paymentId!,
            createdAt: enrollment.createdAt.toISOString(),
            updatedAt: enrollment.updatedAt.toISOString(),
          })),
          total: result.totalCount,
        });
      })
      .catch((error: Error) => {
        this.handleError(error, callback);
      });
  }

  verifyChatAccess(
    call: ServerUnaryCall<VerifyChatAccessRequest, VerifyChatAccessResponse>,
    callback: sendUnaryData<VerifyChatAccessResponse>,
  ) {
    this.verifyChatAccessUseCase
      .execute({
        learnerId: call.request.learnerId,
        instructorId: call.request.instructorId,
      })
      .then((result) => {
        callback(null, {
          hasAccess: result.hasAccess,
        });
      })
      .catch((error: Error) => {
        this.handleError(error, callback);
      });
  }

  private handleError<T>(error: Error, callback: sendUnaryData<T>) {
    if (error instanceof Exception) {
      const serviceError = {
        name: 'UserServiceError',
        code: getGrpcStatusCode(error.code),
        message: error.message,
      };
      callback(serviceError, null);
    }
    const serviceError = {
      name: 'UserServiceError',
      code: status.INTERNAL,
      message: 'Failed to process request',
    };
    callback(serviceError, null);
  }
}
