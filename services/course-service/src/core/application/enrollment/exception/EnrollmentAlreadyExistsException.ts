import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

export class EnrollmentAlreadyExistsException extends Exception<{
  enrollmentId: string;
}> {
  constructor(enrollmentId: string) {
    super({
      codeDescription: Code.CONFLICT_ERROR,
      overrideMessage: 'Enrollment already exists',
      data: { enrollmentId },
    });
  }
}
