import { MongoosePaymentRepository } from '@infrastructure/database/repository/MongoosePaymentReposiory';
import { PaymentDITokens } from '@payment/di/PaymentDITokens';
import type { IPaymentRepository } from '@payment/repository/PaymentRepository';
import { PaymentService } from '@payment/service/PaymentService';
import { StripeService } from '@payment/service/StripeService';
import { ContainerModule } from 'inversify';

export const PaymentModule: ContainerModule = new ContainerModule((options) => {
  //Service
  options
    .bind<PaymentService>(PaymentDITokens.PaymentService)
    .to(PaymentService)
    .inSingletonScope();

  options
    .bind<StripeService>(PaymentDITokens.StripeService)
    .to(StripeService)
    .inSingletonScope();

  //Repository
  options
    .bind<IPaymentRepository>(PaymentDITokens.PaymentRepository)
    .to(MongoosePaymentRepository);
});
