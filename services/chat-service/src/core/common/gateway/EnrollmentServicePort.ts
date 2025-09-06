export interface EnrollmentServicePort {
  verifyChatAccess(
    instructorId: string,
    learnerId: string,
  ): Promise<{ hasAccess: boolean }>;
}
