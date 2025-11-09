import { Code } from './Code';
import { Exception } from './Exception';

export class EntityIdEmptyException extends Exception<{ entityName: string }> {
  constructor(entityName: string) {
    super({
      codeDescription: Code.VALIDATION_ERROR,
      data: { entityName },
    });
  }
}
