import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

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
