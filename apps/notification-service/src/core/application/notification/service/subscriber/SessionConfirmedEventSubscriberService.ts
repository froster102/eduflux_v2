import { NotificationDITokens } from '@core/application/notification/di/NotificationDITokens';
import type { SessionConfirmedEventSubscriber } from '@core/application/notification/subscriber/SessionConfirmedEventSubscriber';
import type { EmailServicePort } from '@core/application/notification/port/gateway/EmailServicePort';
import type { TemplateServicePort } from '@core/application/notification/port/gateway/TemplateServicePort';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import type { NotificationRepositoryPort } from '@core/application/notification/port/persistence/NotificationRepositoryPort';
import { NotificationUseCaseDto } from '@core/application/notification/usecase/dto/NotificationUseCaseDto';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { eventEmitter } from '@core/common/util/event/eventEmitter';
import { Notification } from '@core/domain/notification/entiy/Notification';
import { NotificationStatus } from '@core/domain/notification/enum/NotificationStatus';
import { ServerEvents } from '@shared/enum/ServerEvents';
import type { SessionConfirmedEvent } from '@eduflux-v2/shared/events/session/SessionConfirmedEvent';
import type { ServerEvent } from '@shared/types/ServerEvent';
import { inject } from 'inversify';
import { v4 as uuidV4 } from 'uuid';
import { SessionConfirmedEvent as SessionConfirmedEventClass } from '@eduflux-v2/shared/events/session/SessionConfirmedEvent';

export class SessionConfirmedEventSubscriberService
  implements SessionConfirmedEventSubscriber
{
  constructor(
    @inject(NotificationDITokens.NotificationRepository)
    private readonly notificationRepository: NotificationRepositoryPort,
    @inject(SharedCoreDITokens.UserService)
    private readonly userService: UserServicePort,
    @inject(NotificationDITokens.TemplateService)
    private readonly templateService: TemplateServicePort,
    @inject(NotificationDITokens.EmailService)
    private readonly emailService: EmailServicePort,
  ) {}

  async on(event: SessionConfirmedEvent): Promise<void> {
    const { instructorId, learnerId, path, joinLink, startTime } = event.payload;

    const instructor = await this.userService.getUser(instructorId);
    const learner = await this.userService.getUser(learnerId);

    const timestamp = new Date().toISOString();
    const instructorName = `${instructor.firstName} ${instructor.lastName}`;
    const learnerName = `${learner.firstName} ${learner.lastName}`;
    const status = NotificationStatus.UNSEEN;

    const unsubscribeLink = ``;
    const privacyLink = ``;
    const sessionTitle = `Session with instructor ${instructorName}`;

    const learnerNotification = Notification.create({
      id: uuidV4(),
      userId: learnerId,
      title: 'Session Booked',
      description: `Your session with ${instructorName} is confirmed. You'll receive an email shortly.`,
      timestamp,
      path,
      status,
    });

    const learnerNotificationUseCaseDto =
      NotificationUseCaseDto.fromEntity(learnerNotification);
    await this.notificationRepository.save(learnerNotification);

    const learnerEventPayload: ServerEvent<NotificationUseCaseDto> = {
      payload: learnerNotificationUseCaseDto,
      type: ServerEvents.USER_NOTIFICATON,
    };
    eventEmitter.emit(ServerEvents.USER_NOTIFICATON, learnerEventPayload);

    const formattedDate = new Date(startTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = new Date(startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    const learnerEmailData = {
      userName: learner.firstName,
      message: `Great news! Your session with instructor "${instructorName}" has been confirmed. We're excited to have you join us for this interactive learning experience.`,
      sessionDate: formattedDate,
      sessionTime: formattedTime,
      instructorName,
      joinLink,
      unsubscribeLink,
      privacyLink,
    };
    const learnerEmailHtml = this.templateService.render(
      'session-confirmed',
      learnerEmailData,
    );
    await this.emailService.sendEmail({
      to: learner.email,
      subject: `Session Confirmed: ${sessionTitle}`,
      html: learnerEmailHtml,
    });

    const instructorNotification = Notification.create({
      id: uuidV4(),
      userId: instructorId,
      title: 'New Session',
      description: `A new session with ${learnerName} is confirmed. You'll receive an email shortly.`,
      timestamp,
      status,
      path,
    });

    const instructorNotificationUseCaseDto = NotificationUseCaseDto.fromEntity(
      instructorNotification,
    );
    await this.notificationRepository.save(instructorNotification);

    const instructorEventPayload: ServerEvent<NotificationUseCaseDto> = {
      payload: instructorNotificationUseCaseDto,
      type: ServerEvents.USER_NOTIFICATON,
    };
    eventEmitter.emit(ServerEvents.USER_NOTIFICATON, instructorEventPayload);
  }

  subscribedTo() {
    return [SessionConfirmedEventClass];
  }
}

