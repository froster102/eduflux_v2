import type { CreateMessagePort } from "@core/application/message/port/usecase/CreateMessagePort";
import type { UseCase } from "@core/common/usecase/UseCase";

export interface CreateMessageUseCase
  extends UseCase<CreateMessagePort, void> {}
