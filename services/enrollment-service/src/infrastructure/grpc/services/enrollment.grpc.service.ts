import type { ICheckUserEnrollmentUseCase } from '@/application/use-cases/interface/check-user-enrollment.inerface';
import type { IGetUserEnrollmentsUseCase } from '@/application/use-cases/interface/get-user-enrollments.interface';
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import {
  CheckUserEnrollmentRequest,
  CheckUserEnrollmentResponse,
  Enrollments,
  EnrollmentServiceServer,
  GetUserEnrollmentsRequest,
} from '../generated/enrollment';
import { Logger } from '@/shared/utils/logger';
import { ENROLLMENT_SERVICE } from '@/shared/constants/service';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { DomainException } from '@/domain/exceptions/domain.exception';
import { getGrpcStatusCode } from '@/shared/errors/error-code';
import { ApplicationException } from '@/application/exceptions/application.exception';

export class GrpcEnrollmentService implements EnrollmentServiceServer {
  private logger = new Logger(ENROLLMENT_SERVICE);

  constructor(
    @inject(TYPES.CheckUserEnrollmentUseCase)
    private readonly checkUserEnrollmenntUseCase: ICheckUserEnrollmentUseCase,
    @inject(TYPES.GetUserEnrollmentsUseCase)
    private readonly getUserEnrollmentsUseCase: IGetUserEnrollmentsUseCase,
  ) {}

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
        this.logger.error(
          `Error checking user course enrollment ${error.message}`,
        );
        if (
          error instanceof ApplicationException ||
          error instanceof DomainException
        ) {
          const serviceError = {
            name: 'EnrollmentServiceError',
            code: getGrpcStatusCode(error.code),
            message: `Failed to process request ${error.message} `,
          };
          callback(serviceError, null);
        }
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
        pagination: {
          ...call.request.pagination,
          sortOrder: call.request.pagination?.sortOrder as 'asc' | 'desc',
        },
      })
      .then((result) => {
        callback(null, result);
      })
      .catch((error: Error) => {
        this.logger.error(
          `Error fetching user course enrollments ${error.message}`,
        );
        if (
          error instanceof ApplicationException ||
          error instanceof DomainException
        ) {
          const serviceError = {
            name: 'EnrollmentServiceError',
            code: getGrpcStatusCode(error.code),
            message: `Failed to process request ${error.message} `,
          };
          callback(serviceError, null);
        }
      });
  }
}
