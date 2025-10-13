import { InfrastructureModule } from '@di/InfrastructureModule';
import { CourseModule } from '@di/CourseModule';
import { ChapterModule } from '@di/ChapterModule';
import { LectureModule } from '@di/LectureModule';
import { AssetModule } from '@di/AssetModule';
import { Container } from 'inversify';

const container = new Container();
void (async () => {
  await container.load(
    CourseModule,
    ChapterModule,
    LectureModule,
    AssetModule,
    InfrastructureModule,
  );
})();

export { container };
