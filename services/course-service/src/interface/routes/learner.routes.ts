import Elysia from 'elysia';
import { injectable } from 'inversify';

@injectable()
export class LearnerRoutes {
  constructor() {}

  register(): Elysia {
    return new Elysia().group('/api/courses', (group) =>
      group.get('/me/subscriber-curriculum-items/:courseId', () => {}),
    );
  }
}
