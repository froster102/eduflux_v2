import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@heroui/skeleton";

import { getGreeting } from "@/utils/date";
import { useAuthStore } from "@/store/auth-store";
import StatisticsCard from "@/components/StatisticsCard";
import { useGetLearnerStats } from "@/features/learner/hooks/useGetLearnerStats";

export const Route = createFileRoute("/_layout/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const { data: learnerStats, isPending: isLearnerStatsPending } =
    useGetLearnerStats();

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center pr-2 w-full">
        <div className="w-full">
          <p className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-medium">
            {getGreeting()}, {user?.name.split(" ")[0]} 👋
          </p>
          <p className="text-sm  pt-2">
            Welcome to Eduflux, check your priority learning.
          </p>
        </div>
        <div className="flex w-full gap-4">
          {isLearnerStatsPending ? (
            <Skeleton />
          ) : (
            learnerStats && (
              <>
                <StatisticsCard
                  title={"Completed course"}
                  value={learnerStats.completedCourses + ""}
                />
                <StatisticsCard
                  title={"Session completed"}
                  value={learnerStats.completedSessions + ""}
                />
                <StatisticsCard
                  title={"Enrolled courses"}
                  value={learnerStats.enrolledCourses + ""}
                />
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
