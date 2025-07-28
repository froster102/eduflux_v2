import type { ICronServices } from './interface/cron-services.interface';
import type { IUseCase } from '@/application/use-cases/interface/use-case.interface';
import { SESSION_SERVICE } from '@/shared/constants/services';
import { TYPES } from '@/shared/di/types';
import { Logger } from '@/shared/utils/logger';
import { tryCatch } from '@/shared/utils/try-catch';
import { inject } from 'inversify';
import nodeCron from 'node-cron';

export class CronServices implements ICronServices {
  private logger = new Logger(SESSION_SERVICE);
  constructor(
    @inject(TYPES.HandleExpiredPendingPaymentsUseCase)
    private readonly handleExpiredPendingPaymentsUseCase: IUseCase<void, void>,
  ) {}

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
