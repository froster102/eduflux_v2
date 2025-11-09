import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Skeleton } from '@heroui/skeleton';

import { useAuthStore } from '@/store/auth-store';
import { useGetLearnerStats } from '@/features/learner/hooks/useGetLearnerStats';
import StatsCard from '@/components/StatsCard';
import UpcomingSessionSection from '@/features/session/components/UpcomingSessionSection';
import { Role } from '@/shared/enums/Role';
import EventManager from '@/features/event/components/EventManager';
import TopCoursesSection from '@/features/course/components/TopCoursesSection';

export const Route = createFileRoute('/_layout/home/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: learnerStats, isPending: isLearnerStatsPending } =
    useGetLearnerStats();

  const onViewAllSession = () => {
    navigate({ to: '/sessions' });
  };

  const onViewAllCourses = () => {
    navigate({ to: '/courses' });
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full p-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-sm pt-2 text-default-500">
          Welcome to Eduflux, check your priority learning.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLearnerStatsPending ? (
          <>
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
          </>
        ) : (
          learnerStats?.data && (
            <>
              <StatsCard
                title="Completed Courses"
                value={learnerStats.data.completedCourses + ''}
              />
              <StatsCard
                title="Completed Sessions"
                value={learnerStats.data.completedSessions + ''}
              />
              <StatsCard
                title="Enrolled Courses"
                value={learnerStats.data.enrolledCourses + ''}
              />
            </>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EventManager />

        <UpcomingSessionSection
          preferedRole={Role.LEARNER}
          onViewAll={onViewAllSession}
        />
      </div>

      <TopCoursesSection onViewAll={onViewAllCourses} />
    </div>
  );
}
