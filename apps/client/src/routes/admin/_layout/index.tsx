import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@heroui/skeleton';

import StatsCard from '@/components/StatsCard';
import UserGrowthRadarChart from '@/features/analytics/components/UserGrowthRadarChart';
import RevenueTrendsLineChart from '@/features/analytics/components/RevenueTrendsLineChart';
import TopCoursesCard from '@/features/analytics/components/TopCoursesCard';
import TopInstructorsCard from '@/features/analytics/components/TopInstructorsCard';
import { useAuthStore } from '@/store/auth-store';
import { useGetApplicationStats } from '@/features/analytics/hooks/useGetApplicatoinStats';

export const Route = createFileRoute('/admin/_layout/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const { data: applicationStats, isPending: isApplicationStatsPending } =
    useGetApplicationStats();

  return (
    <div className="flex flex-col gap-6 w-full h-full p-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-sm pt-2 text-default-500">
          Welcome to your Eduflux dashboard.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isApplicationStatsPending ? (
          <>
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
          </>
        ) : (
          true && (
            <>
              <StatsCard
                title="Learners"
                value={applicationStats?.data?.totalLearners + ''}
              />
              <StatsCard
                title="Courses"
                value={applicationStats?.data?.totalCourses + ''}
              />
              <StatsCard
                title="Platform Earnings"
                value={`$${applicationStats?.data?.platformEarnings}`}
              />
              <StatsCard
                title="Instructors"
                value={applicationStats?.data?.totalInstructors + ''}
              />
            </>
          )
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <UserGrowthRadarChart />
        <RevenueTrendsLineChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <TopCoursesCard />
        <TopInstructorsCard />
      </div>
    </div>
  );
}
