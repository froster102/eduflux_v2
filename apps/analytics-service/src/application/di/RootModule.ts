import { InfrastructureModule } from '@application/di/InfrastructureModule';
import { AnalyticsModule } from '@application/di/AnalyticsModule';
import { Container } from 'inversify';

const container = new Container();
void (async () => {
  await container.load(InfrastructureModule, AnalyticsModule);
})();

export { container };

