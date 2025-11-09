import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

export class InstructorNotFoundException extends Exception<{
  instructorId: string;
}> {
  constructor(instructorId: string) {
    super({
      codeDescription: Code.NOT_FOUND_ERROR,
      overrideMessage: 'Instructor not found.',
      data: {
        instructorId,
      },
    });
  }
}
