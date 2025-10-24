import { InfrastructureModule } from '@application/di/InfrastructureModule';
import { PaymentModule } from '@application/di/PaymentModule';
import { Container } from 'inversify';

const container = new Container();
void (async () => {
  await container.load(InfrastructureModule, PaymentModule);
})();

export { container };
