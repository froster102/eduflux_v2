import { InstructorViewDITokens } from '@application/views/instructor-view/di/InstructorViewDITokens';
import { SessionSettingsUpdateEvent } from '@eduflux-v2/shared/events/session/SessionSettingsUpdateEvent';
import type { SessionSettingsUpdatedEventSubscriber } from '@application/views/instructor-view/subscriber/SessionSettingsUpdatedEventSubscriber';
import type {
  InstructorViewRepositoryPort,
  UpsertPayload,
} from '@application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import { inject } from 'inversify';

export class SessionSettingsUpdatedEventSubscriberService
  implements SessionSettingsUpdatedEventSubscriber
{
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,
  ) {}

  public async on(event: SessionSettingsUpdateEvent): Promise<void> {
    const {
      instructorId,
      price,
      currency,
      duration,
      timeZone,
      // isSchedulingEnabled,
    } = event.payload;

    const updatePayload: UpsertPayload = {
      'pricing.price': price,
      'pricing.currency': currency,
      'pricing.duration': duration,
      'pricing.timeZone': timeZone,
      // 'pricing.isSchedulingEnabled': isSchedulingEnabled,
    };

    await this.instructorViewRepository.upsert(instructorId, updatePayload);
  }

  subscribedTo() {
    return [SessionSettingsUpdateEvent];
  }
}

