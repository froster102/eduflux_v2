import { InfrastructureModule } from '@di/InfrastructureModule';
import { SessionModule } from '@di/SessionModule';
import { SessionSettingsModule } from '@di/SessionSettingsModule';
import { SlotModule } from '@di/SlotModule';
import { UserSessionModule } from '@di/UserSessionModule';
import { Container } from 'inversify';

const container = new Container();
void (async () => {
  await container.load(
    SessionModule,
    SessionSettingsModule,
    SlotModule,
    InfrastructureModule,
    UserSessionModule,
  );
})();

export { container };
