import { Skeleton } from "@heroui/skeleton";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Divider } from "@heroui/divider";

import StatisticsCard from "@/components/StatisticsCard";
import AnalyticsChart from "@/features/components/AnalyticsRadarChart";
import { useGetAdminDataQuery } from "@/features/admin/dashboard/hooks/queries";

export default function OverviewPage() {
  const { data: dashboardData, isLoading: isDashboardDataLoading } =
    useGetAdminDataQuery();

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
              title="Total Students"
              value={dashboardData?.metrics.totalStudents}
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
              title="Total Tutors"
              value={dashboardData?.metrics.totalTutors}
            />
          </Skeleton>
          <Skeleton
            className="rounded-lg w-full"
            isLoaded={!isDashboardDataLoading}
          >
            <StatisticsCard
              icon={<Icon icon="solar:notebook-bookmark-linear" width={28} />}
              title="Total Courses"
              value={dashboardData?.metrics.totalCourses}
            />
          </Skeleton>
        </div>
        <div className="flex flex-col md:flex md:flex-row w-full gap-4 max-w-lg">
          <Skeleton
            className="rounded-lg w-full"
            isLoaded={!isDashboardDataLoading}
          >
            {!isDashboardDataLoading && (
              <AnalyticsChart
                angleAxisDataKey="label"
                classNames={{
                  wrapper: "max-w-lg",
                }}
                data={(dashboardData?.graphs as any).loginTrends || []}
                name="Login"
                radarDataKey="value"
                timeframe="weekly"
                title="User Logins"
              />
            )}
          </Skeleton>
          {/* <AnalyticsChart
            angleAxisDataKey="week"
            data={data}
            name="Logins"
            radarDataKey="count"
            timeframe="weekly"
            title="Enrollment"
          /> */}
        </div>
      </div>
    </>
  );
}
