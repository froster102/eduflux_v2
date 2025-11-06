import { CheckoutDITokens } from '@core/application/checkout/di/CheckoutDITokens';
import type { HandleCheckoutUseCase } from '@core/application/checkout/usecase/HandleCheckoutUseCase';
import { HandleCheckoutService } from '@core/application/checkout/service/usecase/HandleCheckoutService';
import type { PaymentSuccessfullEventSubscriber } from '@core/application/checkout/subscriber/PaymentSuccessfullSubscriber';
import { PaymentSuccessfullEventSubscriberService } from '@core/application/checkout/service/subscriber/PaymentSuccessfullEventSubscriberService';
import { CheckoutController } from '@api/http/controller/CheckoutController';
import { ContainerModule } from 'inversify';

export const CheckoutModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-cases
    options
      .bind<HandleCheckoutUseCase>(CheckoutDITokens.HandleCheckoutUseCase)
      .to(HandleCheckoutService);

    //Subscribers
    options
      .bind<PaymentSuccessfullEventSubscriber>(
        CheckoutDITokens.PaymentSuccessfullEventSubscriber,
      )
      .to(PaymentSuccessfullEventSubscriberService);

    //Controllers
    options
      .bind<CheckoutController>(CheckoutDITokens.CheckoutController)
      .to(CheckoutController);
  },
);
