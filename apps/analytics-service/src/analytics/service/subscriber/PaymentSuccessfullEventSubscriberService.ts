import { AnalyticsDITokens } from '@analytics/di/AnalyticsDITokens';
import type { IApplicationStatsRepository } from '@analytics/repository/ApplicationStatsRepository';
import type { PaymentSuccessfullEventSubscriber } from '@analytics/subscriber/PaymentSuccessfullEventSubscriber';
import { PaymentSuccessfullEvent } from '@eduflux-v2/shared/events/payment/PaymentSuccessfullEvent';
import { inject } from 'inversify';

export class PaymentSuccessfullEventSubscriberService
  implements PaymentSuccessfullEventSubscriber
{
  constructor(
    @inject(AnalyticsDITokens.ApplicationStatsRepository)
    private readonly applicationStatsRepository: IApplicationStatsRepository,
  ) {}

  async on(event: PaymentSuccessfullEvent): Promise<void> {
    // Add platform fee to total platform earnings
    const platformFee = event.payload.platformFee;
    await this.applicationStatsRepository.addPlatformEarnings(platformFee);
  }

  subscribedTo() {
    return [PaymentSuccessfullEvent];
  }
}
