import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from '@heroui/skeleton';

import UpcomingSessionSection from '@/features/session/components/UpcomingSessionSection';
import TaskManager from '@/features/task/components/TaskManager';
import StatsCard from '@/components/StatsCard';
import { useAuthStore } from '@/store/auth-store';

export const Route = createFileRoute('/admin/_layout/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();

  console.log('called');

  return (
    <div className="flex flex-col gap-6 w-full h-full p-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-sm pt-2 text-default-500">
          Welcome to your Eduflux dashboard.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {false ? (
          <>
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
            <Skeleton className="h-20 rounded-lg !bg-default-200" />
          </>
        ) : (
          true && (
            <>
              <StatsCard title="Learners" value={12} />
              <StatsCard title="Courses" value={2323} />
              <StatsCard title="Total Revenue" value="$14" />
              <StatsCard title="Instructors" value={323} />
            </>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskManager />

        <UpcomingSessionSection />
      </div>
    </div>
  );
}
