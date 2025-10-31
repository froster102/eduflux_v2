import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { AutoCompleteSessionsUseCase } from '@core/application/session/usecase/AutoCompleteSessionsUseCase';
import type { HandleExpiredPendingPaymentsUseCase } from '@core/application/session/usecase/HandleExpiredPendingPaymentsUseCase';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import type { ICronServices } from '@infrastructure/cron/interface/cron-services.interface';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import { inject } from 'inversify';
import nodeCron from 'node-cron';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';

export class CronServices implements ICronServices {
  constructor(
    @inject(SharedCoreDITokens.Logger) private readonly logger: LoggerPort,
    @inject(SessionDITokens.HandleExpiredPendingPaymentsUseCase)
    private readonly handleExpiredPendingPaymentsUseCase: HandleExpiredPendingPaymentsUseCase,
    @inject(SessionDITokens.AutoCompleteSessionsUseCase)
    private readonly autoCompleteSessionsUseCase: AutoCompleteSessionsUseCase,
  ) {
    this.logger = logger.fromContext(CronServices.name);
  }
  //*/5 * * * * *
  register(): void {
    nodeCron.schedule('0 */5 * * * *', async () => {
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

    nodeCron.schedule('*/5 * * * *', async () => {
      const { error } = await tryCatch(
        this.autoCompleteSessionsUseCase.execute(),
      );

      if (error) {
        this.logger.error(
          `AutoCompleteSessionsUseCase failed error: ${error?.message}`,
          error as Record<string, any>,
        );
      }
    });

    this.logger.info('Registered cron services.');
  }
}
