import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

export class NoUserEnrollmentException extends Exception<{
  userId: string;
  instructorId: string;
}> {
  constructor(userId: string, instructorId: string) {
    super({
      codeDescription: Code.FORBIDDEN_ERROR,
      overrideMessage:
        "User does not have chat access with the instructor,Please enroll for any of the instructor's course to get access.",
      data: { userId, instructorId },
    });
  }
}
