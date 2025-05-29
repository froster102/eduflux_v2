import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";
import { Icon } from "@iconify/react/dist/iconify.js";

import StatisticsCard from "@/components/StatisticsCard";
import CalendarView from "@/components/CalendarView";
import { useGetTutorDashboardQuery } from "@/features/instructor/dashboard/hooks/queries";

export default function OverviewPage() {
  const { data: dashboardData, isLoading: isDashboardDataLoading } =
    useGetTutorDashboardQuery();

  return (
    <>
      <div>
        <p className="text-2xl font-bold">Overview</p>
        <small className="text-default-500 text-sm">
          Showing the dashboard overview
        </small>
      </div>
      <Divider className="mt-4" orientation="horizontal" />
      <div className="flex flex-col gap-4 w-full h-full">
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-4">
          <Skeleton
            className="rounded-lg w-full"
            isLoaded={!isDashboardDataLoading}
          >
            <StatisticsCard
              icon={<Icon icon="solar:user-id-outline" width={28} />}
              title="Total Sessions"
              value={dashboardData?.metrics.totalSessions}
            />
          </Skeleton>
          <Skeleton
            className="rounded-lg w-full"
            isLoaded={!isDashboardDataLoading}
          >
            <StatisticsCard
              icon={
                <Icon icon="solar:users-group-rounded-outline" width={28} />
              }
              title="Assigned Course"
              value={dashboardData?.metrics.totalCourseAssigned}
            />
          </Skeleton>
        </div>
        <CalendarView />
      </div>
    </>
  );
}
