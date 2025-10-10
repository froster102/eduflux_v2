import { InstructorViewDITokens } from '@core/application/views/instructor-view/di/InstructorViewDITokens';
import type { SessionSettingsUpdateEvent } from '@core/application/views/instructor-view/events/SessionSettingsEvent';
import type { SessionSettingsUpdatedEventHandler } from '@core/application/views/instructor-view/handler/SessionSettingsUpdatedEventHandler';
import type {
  InstructorViewRepositoryPort,
  UpsertPayload,
} from '@core/application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import { inject } from 'inversify';

export class SessionSettingsUpdatedEventHandlerService
  implements SessionSettingsUpdatedEventHandler
{
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,
  ) {}

  public async handle(event: SessionSettingsUpdateEvent): Promise<void> {
    const {
      instructorId,
      price,
      currency,
      duration,
      timeZone,
      // isSchedulingEnabled,
    } = event;

    const updatePayload: UpsertPayload = {
      'pricing.price': price,
      'pricing.currency': currency,
      'pricing.duration': duration,
      'pricing.timeZone': timeZone,
      // 'pricing.isSchedulingEnabled': isSchedulingEnabled,
    };

    await this.instructorViewRepository.upsert(instructorId, updatePayload);
  }
}
