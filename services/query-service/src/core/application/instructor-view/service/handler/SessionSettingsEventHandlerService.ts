import { InstructorViewDITokens } from "@core/application/instructor-view/di/InstructorViewDITokens";
import type { SessionSettingsEvent } from "@core/application/instructor-view/events/SessionSettingsEvent";
import type { SessionSettingsEventHandler } from "@core/application/instructor-view/handler/SessionSettingsEventHandler";
import type {
  InstructorViewRepositoryPort,
  UpsertPayload,
} from "@core/application/instructor-view/port/persistence/InstructorViewRepositoryPort";
import { inject } from "inversify";

export class SessionSettingsEventHandlerService
  implements SessionSettingsEventHandler
{
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,
  ) {}

  public async handle(event: SessionSettingsEvent): Promise<void> {
    const {
      instructorId,
      price,
      currency,
      duration,
      timeZone,
      isSchedulingEnabled,
    } = event.data;

    const updatePayload: UpsertPayload = {
      "pricing.price": price,
      "pricing.currency": currency,
      "pricing.duration": duration,
      "pricing.timeZone": timeZone,
      "pricing.isSchedulingEnabled": isSchedulingEnabled,
    };

    await this.instructorViewRepository.upsert(instructorId, updatePayload);
  }
}
