import { EnrollmentModule } from 'src/di/EnrollmentModule';
import { Container } from 'inversify';
import { InfrastructureModule } from '@di/InfrastructureModule';

const container = new Container();
void (async () => {
  await container.load(EnrollmentModule, InfrastructureModule);
})();

export { container };
