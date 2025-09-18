import { NotificationDITokens } from "@core/application/notification/di/NotificationDITokens";
import type { EnrollmentEventHandler } from "@core/application/notification/handler/EnrollmentEventHandler";
import type { CourseServicePort } from "@core/application/notification/port/gateway/CourseServicePort";
import type { NotificationRepositoryPort } from "@core/application/notification/port/persistence/NotificationRepositoryPort";
import { NotificationUseCaseDto } from "@core/application/notification/usecase/dto/NotificationUseCaseDto";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import { eventEmitter } from "@core/common/util/event/eventEmitter";
import { Notification } from "@core/domain/notification/entiy/Notification";
import { NotificationStatus } from "@core/domain/notification/enum/NotificationStatus";
import { ServerEvents } from "@shared/enum/ServerEvents";
import type { EnrollmentEvent } from "@shared/events/EnrollmentEvent";
import type { ServerEvent } from "@shared/types/ServerEvent";
import { inject } from "inversify";
import { v4 as uuidV4 } from "uuid";

export class EnrollmentEventHandlerService implements EnrollmentEventHandler {
  constructor(
    @inject(NotificationDITokens.NotificationRepository)
    private readonly notificationRepository: NotificationRepositoryPort,
    @inject(CoreDITokens.CourseService)
    private readonly courseService: CourseServicePort,
  ) {}

  async handle(event: EnrollmentEvent): Promise<void> {
    const { courseId, path, userId } = event.data;

    //get course details course service
    const course = await this.courseService.getCourse(courseId);

    const notification = Notification.create({
      id: uuidV4(),
      userId,
      title: "Course Enrollment",
      description: `You have successfully enrolled for the course ${course.title}`,
      path,
      status: NotificationStatus.UNSEEN,
      timestamp: new Date().toISOString(),
    });

    await this.notificationRepository.save(notification);

    const notificationUseCaseDto =
      NotificationUseCaseDto.fromEntity(notification);

    const serverEventPayload: ServerEvent<NotificationUseCaseDto> = {
      payload: notificationUseCaseDto,
      type: ServerEvents.USER_NOTIFICATON,
    };

    eventEmitter.emit(ServerEvents.USER_NOTIFICATON, serverEventPayload);

    return;
  }
}
