import { AnalyticsDITokens } from '@analytics/di/AnalyticsDITokens';
import type { AnalyticsService } from '@analytics/service/AnalyticsService';
import { authenticaionMiddleware } from '@application/api/http/middleware/authenticationMiddleware';
import { jsonApiResponse } from '@eduflux-v2/shared/utils/jsonApi';
import Elysia from 'elysia';
import { inject } from 'inversify';

export class AnalyticsController {
  constructor(
    @inject(AnalyticsDITokens.AnalyticsService)
    private readonly analyticsService: AnalyticsService,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/analytics', (group) =>
      group
        .use(authenticaionMiddleware)
        .get('/application-stats', async ({ user }) => {
          const stats = await this.analyticsService.getApplicationStats({
            exectutor: user,
          });
          return jsonApiResponse({
            data: {
              id: stats.id,
              totalLearners: stats.totalLearners,
              totalInstructors: stats.totalInstructors,
              totalCourses: stats.totalCourses,
              platformEarnings: stats.platformEarnings,
              createdAt: stats.createdAt,
              updatedAt: stats.updatedAt,
            },
          });
        })
        .get('/user-growth', async ({ user }) => {
          const growthData = await this.analyticsService.getUserGrowth({
            executor: user,
          });
          return jsonApiResponse({
            data: growthData,
          });
        }),
    );
  }
}
