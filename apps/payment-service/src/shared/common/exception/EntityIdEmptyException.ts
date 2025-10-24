import { Code } from '@shared/common/error/Code';
import { Exception } from '@shared/common/exception/Exception';

export class EntityIdEmptyException extends Exception<{ entityName: string }> {
  constructor(entityName: string) {
    super({
      codeDescription: Code.VALIDATION_ERROR,
      data: { entityName },
    });
  }
}
