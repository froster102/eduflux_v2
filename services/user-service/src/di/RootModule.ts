import { InfrastructureModule } from '@di/InfrastructureModule';
import { InstructorModule } from '@di/InstructorModule';
import { InstructorViewModule } from '@di/InstructorViewModule';
import { LearnerStatsModule } from '@di/LearnerStatsModule';
import { ProgressModule } from '@di/ProgressModule';
import { SubscribedCourseViewModule } from '@di/SubscribedCourseViewModule';
import { UserModule } from '@di/UserModule';
import { Container } from 'inversify';

const container = new Container();

void (async () => {
  await container.load(
    ProgressModule,
    UserModule,
    InstructorModule,
    InfrastructureModule,
    LearnerStatsModule,
    InstructorViewModule,
    SubscribedCourseViewModule,
  );
})();

export { container };
