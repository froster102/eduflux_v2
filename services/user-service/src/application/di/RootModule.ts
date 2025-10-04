import { InfrastructureModule } from '@application/di/InfrastructureModule';
import { InstructorModule } from '@application/di/InstructorModule';
import { LearnerStatsModule } from '@application/di/LearnerStatsModule';
import { ProgressModule } from '@application/di/ProgressModule';
import { UserModule } from '@application/di/UserModule';
import { Container } from 'inversify';

const container = new Container();

void (async () => {
  await container.load(
    ProgressModule,
    UserModule,
    InstructorModule,
    InfrastructureModule,
    LearnerStatsModule,
  );
})();

export { container };
