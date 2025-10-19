import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

export class EnrollmentNotFoundException extends Exception<{
  enrollmentId: string;
}> {
  constructor(enrollmentId: string) {
    super({
      codeDescription: Code.NOT_FOUND_ERROR,
      overrideMessage: 'Enrollment not found.',
      data: {
        enrollmentId,
      },
    });
  }
}
