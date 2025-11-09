export interface EnrollmentServiceGatewayPort {
  checkUserEnrollment(
    userId: string,
    courseId: string,
  ): Promise<{
    isEnrolled: boolean;
  }>;
}
