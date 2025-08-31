import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

export class CourseNotFoundException extends Exception<{ courseId: string }> {
  constructor(courseId: string) {
    super({
      codeDescription: Code.NOT_FOUND_ERROR,
      overrideMessage: 'Course not found.',
      data: { courseId },
    });
  }
}
