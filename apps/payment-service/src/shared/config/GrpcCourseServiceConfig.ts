import { envVariables } from '@shared/env/env-variables';

export class GrpcCourseServiceConfig {
  static readonly GRPC_COURSE_SERVICE_URL =
    envVariables.GRPC_COURSE_SERVICE_URL;
}
