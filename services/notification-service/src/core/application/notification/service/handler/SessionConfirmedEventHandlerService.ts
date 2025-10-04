import { NotificationDITokens } from "@core/application/notification/di/NotificationDITokens";
import type { SessionConfirmedEventHandler } from "@core/application/notification/handler/SessionConfirmedEventHandler";
import type { UserServicePort } from "@core/application/notification/port/gateway/UserServicePort";
import type { NotificationRepositoryPort } from "@core/application/notification/port/persistence/NotificationRepositoryPort";
import { NotificationUseCaseDto } from "@core/application/notification/usecase/dto/NotificationUseCaseDto";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import { eventEmitter } from "@core/common/util/event/eventEmitter";
import { Notification } from "@core/domain/notification/entiy/Notification";
import { NotificationStatus } from "@core/domain/notification/enum/NotificationStatus";
import { ServerEvents } from "@shared/enum/ServerEvents";
import type { SessionConfimedEvent } from "@shared/events/SessionConfirmedEvent";
import type { ServerEvent } from "@shared/types/ServerEvent";
import { inject } from "inversify";
import { v4 as uuidV4 } from "uuid";

export class SessionConfirmedEventHandlerService
  implements SessionConfirmedEventHandler
{
  constructor(
    @inject(NotificationDITokens.NotificationRepository)
    private readonly notificationRepository: NotificationRepositoryPort,
    @inject(CoreDITokens.UserService)
    private readonly userService: UserServicePort,
  ) {}

  async handle(event: SessionConfimedEvent): Promise<void> {
    const { instructorId, learnerId, path } = event;

    const instructor = await this.userService.getUser(instructorId);
    const learner = await this.userService.getUser(learnerId);

    const timestamp = new Date().toISOString();
    const instructorName = `${instructor.firstName} ${instructor.lastName}`;
    const learnerName = `${learner.firstName} ${learner.lastName}`;
    const status = NotificationStatus.UNSEEN;

    const learnerNotification = Notification.create({
      id: uuidV4(),
      userId: learnerId,
      title: "Session Booked",
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

    const instructorNotification = Notification.create({
      id: uuidV4(),
      userId: instructorId,
      title: "New Session",
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
}
