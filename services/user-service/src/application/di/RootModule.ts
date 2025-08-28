import { InfrastructureModule } from '@application/di/InfrastructureModule';
import { ProgressModule } from '@application/di/ProgressModule';
import { UserModule } from '@application/di/UserModule';
import { Container } from 'inversify';

const container = new Container();

void (async () => {
  await container.load(ProgressModule, UserModule, InfrastructureModule);
})();

export { container };
