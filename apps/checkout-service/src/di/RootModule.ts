import { InfrastructureModule } from '@di/InfrastructureModule';
import { CheckoutModule } from '@di/CheckoutModule';
import { Container } from 'inversify';

const container = new Container();
void (async () => {
  await container.load(CheckoutModule, InfrastructureModule);
})();

export { container };

