export interface CourseServicePort {
  verifyChatAccess(
    instructorId: string,
    learnerId: string,
  ): Promise<{ hasAccess: boolean }>;
}
