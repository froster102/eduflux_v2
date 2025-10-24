import { InfrastructureModule } from '@di/InfrastructureModule';
import { CourseModule } from '@di/CourseModule';
import { ChapterModule } from '@di/ChapterModule';
import { LectureModule } from '@di/LectureModule';
import { AssetModule } from '@di/AssetModule';
import { Container } from 'inversify';
import { EnrollmentModule } from '@di/EnrollmentModule';

const container = new Container();
void (async () => {
  await container.load(
    CourseModule,
    ChapterModule,
    LectureModule,
    AssetModule,
    EnrollmentModule,
    InfrastructureModule,
  );
})();

export { container };
