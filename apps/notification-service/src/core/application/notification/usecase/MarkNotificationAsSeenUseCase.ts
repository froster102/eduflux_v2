import type { MarkNotificationAsSeenPort } from "@core/application/notification/port/usecase/MarkNotificationAsSeenPort";
import type { UseCase } from "@core/common/usecase/UseCase";

export interface MarkNotificationAsSeenUseCase
  extends UseCase<MarkNotificationAsSeenPort, void> {}
