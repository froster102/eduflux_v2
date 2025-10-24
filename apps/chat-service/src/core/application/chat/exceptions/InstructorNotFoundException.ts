import { Code } from "@core/common/error/Code";
import { Exception } from "@core/common/exception/Exception";

export class InstructorNotFoundException extends Exception<{
  instructorId: string;
}> {
  constructor(instructorId: string) {
    super({
      codeDescription: Code.NOT_FOUND_ERROR,
      overrideMessage: "Instructor not found.",
      data: {
        instructorId,
      },
    });
  }
}
