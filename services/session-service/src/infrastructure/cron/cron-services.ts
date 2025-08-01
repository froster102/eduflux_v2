import type { ICronServices } from './interface/cron-services.interface';
import type { IUseCase } from '@/application/use-cases/interface/use-case.interface';
import type { ILogger } from '@/shared/common/interface/logger.interface';
import { TYPES } from '@/shared/di/types';
import { tryCatch } from '@/shared/utils/try-catch';
import { inject } from 'inversify';
import nodeCron from 'node-cron';

export class CronServices implements ICronServices {
  constructor(
    @inject(TYPES.Logger) private readonly logger: ILogger,
    @inject(TYPES.HandleExpiredPendingPaymentsUseCase)
    private readonly handleExpiredPendingPaymentsUseCase: IUseCase<void, void>,
  ) {
    this.logger = logger.fromContext(CronServices.name);
  }

  register(): void {
    nodeCron.schedule('*/5 * * * *', async () => {
      const { error } = await tryCatch(
        this.handleExpiredPendingPaymentsUseCase.execute(),
      );

      if (error) {
        this.logger.error(
          `HandleExpiredPendingPaymentsUseCase failed error: ${error?.message}`,
          error as Record<string, any>,
        );
      }
    });

    this.logger.info('Registered cron services.');
  }
}
