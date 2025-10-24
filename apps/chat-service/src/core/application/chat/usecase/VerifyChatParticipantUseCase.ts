import type { VerifyChatParticipantPort } from "@core/application/chat/port/usecase/VerifyChatParticipantPort";
import type { VerifyChatParticipantUseCaseResult } from "@core/application/chat/usecase/type/VerifyChatParticipantUseCaseResult";
import type { UseCase } from "@core/common/usecase/UseCase";

export interface VerifyChatParticipantUseCase
  extends UseCase<
    VerifyChatParticipantPort,
    VerifyChatParticipantUseCaseResult
  > {}
