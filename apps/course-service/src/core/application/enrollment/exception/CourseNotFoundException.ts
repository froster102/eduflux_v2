import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

export class CourseNotFoundException extends Exception<{ courseId: string }> {
  constructor(courseId: string) {
    super({
      codeDescription: Code.NOT_FOUND_ERROR,
      overrideMessage: 'Course not found.',
      data: { courseId },
    });
  }
}
