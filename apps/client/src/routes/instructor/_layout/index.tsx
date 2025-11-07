import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Skeleton } from '@heroui/skeleton';

import StatsCard from '@/components/StatsCard';
import { useAuthStore } from '@/store/auth-store';
import UpcomingSessionSection from '@/features/session/components/UpcomingSessionSection';
import { useGetInstructorStats } from '@/features/instructor/hooks/useGetInstructorStats';
import InstructorCoursesSection from '@/features/course/components/InstructorCoursesSection';
import { Role } from '@/shared/enums/Role';
import EventManager from '@/features/event/components/EventManager';
import { useGetInstructorEarnings } from '@/features/payment/hooks/useGetInstructorEarnings';

export const Route = createFileRoute('/instructor/_layout/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const { data: instructorStats, isPending: isInstructorStatsPending } =
    useGetInstructorStats();
  const { data: instructorEarnings, isPending: isInstructorEarningsLoading } =
    useGetInstructorEarnings();
  const navigate = useNavigate();

  const onViewAllSession = () => {
    navigate({ to: '/instructor/sessions' });
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
        {isInstructorStatsPending ? (
          <>
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
          </>
        ) : (
          instructorStats?.data &&
          instructorEarnings?.data && (
            <>
              <StatsCard
                title="Learners"
                value={instructorStats.data.totalLearners + ''}
              />
              <StatsCard
                title="Courses"
                value={instructorStats.data.totalCourses + ''}
              />
              <StatsCard
                title="Total Earnings"
                value={instructorEarnings.data.earnings + ''}
              />
              <StatsCard
                title="Sessions Conducted"
                value={instructorStats.data.sessionsConducted + ''}
              />
            </>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EventManager />

        <UpcomingSessionSection
          preferedRole={Role.INSTRUCTOR}
          onViewAll={onViewAllSession}
        />
      </div>

      <InstructorCoursesSection />
    </div>
  );
}
