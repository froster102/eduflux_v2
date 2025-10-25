import { Code } from '@core/common/error/Code';
import { Exception } from '@core/common/exception/Exception';

export class NotificationNotFoundException extends Exception<{
  notificationId: string;
}> {
  constructor(notificationId: string) {
    super({
      codeDescription: Code.NOT_FOUND_ERROR,
      overrideMessage: 'User not found',
      data: { notificationId },
    });
  }
}
