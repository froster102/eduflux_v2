import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

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
