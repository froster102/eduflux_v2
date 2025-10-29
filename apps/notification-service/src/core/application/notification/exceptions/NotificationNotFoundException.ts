import { Code } from '@eduflux-v2/shared/exceptions/Code';
import { Exception } from '@eduflux-v2/shared/exceptions/Exception';

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
