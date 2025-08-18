import { PaginationQueryParams } from '@/application/dto/pagination.dto';
import {
  EnrollmentDto,
  GetUserEnrollmentsResponseDto,
  IEnrollmentServiceGateway,
} from '@/application/ports/enrollment-service.gateway';
import {
  CheckUserEnrollmentResponse,
  Enrollments,
  EnrollmentServiceClient,
  GetUserEnrollmentsRequest,
} from '../generated/enrollment';
import { enrollmentServiceGrpcConfig } from '@/shared/config/enrollment-service.grpc.config';
import { credentials, ServiceError } from '@grpc/grpc-js';
import { createClientLoggingInterceptor } from '../interceptors/client-logging.interceptor';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { ILogger } from '@/shared/common/interfaces/logger.interface';

export class GrpcEnrollmentServiceClient implements IEnrollmentServiceGateway {
  private client: EnrollmentServiceClient;
  private address: string;

  constructor(@inject(TYPES.Logger) private readonly logger: ILogger) {
    this.logger = logger.fromContext(GrpcEnrollmentServiceClient.name);
    this.address = enrollmentServiceGrpcConfig.GRPC_ENROLLMENT_SERVICE_URL;
    this.client = new EnrollmentServiceClient(
      this.address,
      credentials.createInsecure(),
      {
        interceptors: [createClientLoggingInterceptor(this.logger)],
      },
    );
    // this.logger.info(
    //   `gRPC enrollment service client initialized, target:${this.address}`,
    // );
  }

  getUserEnrollments(
    userId: string,
    paginationQueryParams: PaginationQueryParams,
  ): Promise<GetUserEnrollmentsResponseDto> {
    const processedFilters: { [key: string]: string } = {};
    if (paginationQueryParams.filters) {
      for (const key in paginationQueryParams.filters) {
        if (
          Object.prototype.hasOwnProperty.call(
            paginationQueryParams.filters,
            key,
          )
        ) {
          processedFilters[key] = String(paginationQueryParams.filters[key]);
        }
      }
    }
    const request: GetUserEnrollmentsRequest = {
      userId,
      pagination: {
        page: paginationQueryParams.page ?? 0,
        filters: processedFilters,
        limit: paginationQueryParams.limit ?? 0,
        searchFields: paginationQueryParams.searchFields ?? [''],
        searchQuery: paginationQueryParams.searchQuery ?? '',
        sortBy: paginationQueryParams.sortBy ?? '',
        sortOrder: paginationQueryParams.sortBy ?? 'asc',
      },
    };
    return new Promise((resolve, reject) =>
      this.client.getUserEnrollments(
        request,
        (error: ServiceError | null, response: Enrollments) => {
          if (error) {
            // this.logger.error(
            //   `Error fetching user enrollment details ${error.message}`,
            // );
            reject(new Error(error.message));
          }
          if (response) {
            resolve({
              total: response.total,
              enrollments: response.enrollments as unknown as EnrollmentDto[],
            });
          }
        },
      ),
    );
  }

  checkUserEnrollment(
    userId: string,
    courseId: string,
  ): Promise<{ isEnrolled: boolean }> {
    return new Promise((resolve, reject) =>
      this.client.checkUserEnrollment(
        { userId, courseId },
        (error: ServiceError | null, response: CheckUserEnrollmentResponse) => {
          if (error) {
            // this.logger.error(
            //   `Error fetching user enrollment details ${error.message}`,
            // );
            reject(new Error(error.message));
          }
          if (response) {
            resolve(response);
          }
        },
      ),
    );
  }
}
