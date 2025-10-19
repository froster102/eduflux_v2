import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { AutoCompleteSessionsUseCase } from '@core/application/session/usecase/AutoCompleteSessionsUseCase';
import type { HandleExpiredPendingPaymentsUseCase } from '@core/application/session/usecase/HandleExpiredPendingPaymentsUseCase';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import type { ICronServices } from '@infrastructure/cron/interface/cron-services.interface';
import { tryCatch } from '@shared/utils/try-catch';
import { inject } from 'inversify';
import nodeCron from 'node-cron';

export class CronServices implements ICronServices {
  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
    @inject(SessionDITokens.HandleExpiredPendingPaymentsUseCase)
    private readonly handleExpiredPendingPaymentsUseCase: HandleExpiredPendingPaymentsUseCase,
    @inject(SessionDITokens.AutoCompleteSessionsUseCase)
    private readonly autoCompleteSessionsUseCase: AutoCompleteSessionsUseCase,
  ) {
    this.logger = logger.fromContext(CronServices.name);
  }
  //*/5 * * * * *
  register(): void {
    nodeCron.schedule('*/5 * * * * *', async () => {
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
