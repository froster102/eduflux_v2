import { envVariables } from '@shared/validation/env-variables';

export class GrpcCourseServiceConfig {
  static readonly GRPC_COURSE_SERVICE_URL =
    envVariables.GRPC_COURSE_SERVICE_URL;
}
