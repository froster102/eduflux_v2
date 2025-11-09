import type { HandleCheckoutPort } from '@core/application/checkout/port/usecase/HandleCheckoutPort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface HandleCheckoutUseCaseResult {
  checkoutUrl: string;
}

export interface HandleCheckoutUseCase
  extends UseCase<HandleCheckoutPort, HandleCheckoutUseCaseResult> {
  execute(port: HandleCheckoutPort): Promise<HandleCheckoutUseCaseResult>;
}
