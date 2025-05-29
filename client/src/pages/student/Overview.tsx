import { Card, CardBody } from "@heroui/card";

import Time from "@/components/Time";
import CalendarView from "@/components/CalendarView";
import { useAuthStore } from "@/store/auth-store";

export default function OverviewPage() {
  const { user, session, authToken } = useAuthStore();
  // const { data: dashboardData, isLoading: isDashboardDataLoading } =
  //   useGetStudentDashboardQuery();
  // const { data: user, isLoading: isUserLoading } = useGetUserQuery(userId);
  // const { data: coursesData, isLoading: isCoursesLoading } =
  //   useGetAllAvailableCoursesQuery();

  console.log(user, session, authToken);

  return (
    <>
      <div className="flex gap-4 w-full h-full pt-4">
        <div className="w-full h-full">
          <div className="flex justify-between items-center w-full">
            {/* <Skeleton className="rounded-lg w-full" isLoaded={!isUserLoading}>
              <p className="font-bold capitalize text-xl md:text-2xl lg:text-4xl">
                Welcome back
                <br />
                {user?.firstName + " " + user?.lastName},
              </p>
            </Skeleton> */}
            <Time
              className="bg-transparent shadow-none w-full p-0 self-end"
              classNames={{
                text: "text-lg md:text-xl lg:text-2xl text-right font-semibold",
              }}
            />
          </div>
          {/* <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-4">
            <Skeleton
              className="rounded-lg w-full"
              isLoaded={!isDashboardDataLoading}
            >
              <StatisticsCard
                title="Enrollments"
                value={dashboardData?.metrics.totalEnrollments}
              />
            </Skeleton>
            <Skeleton
              className="rounded-lg w-full"
              isLoaded={!isDashboardDataLoading}
            >
              <StatisticsCard
                title="Sessions Attempted"
                value={dashboardData?.metrics.totalSessions}
              />
            </Skeleton>
            <Skeleton
              className="rounded-lg w-full"
              isLoaded={!isDashboardDataLoading}
            >
              <StatisticsCard
                title="Completed Courses"
                value={dashboardData?.metrics.totalCompletedCourses}
              />
            </Skeleton>
          </div> */}
          <div className="pt-4 md:flex gap-4 w-full">
            <Card className="border border-transparent dark:border-default-100 w-full bg-background">
              <CardBody>Flash Card</CardBody>
            </Card>
            <CalendarView />
          </div>
          <p className="font-semibold text-lg pt-2">Courses</p>
          {/* <div className="grid gap-4 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {isCoursesLoading ? (
              <Skeleton />
            ) : (
              coursesData &&
              (coursesData.courses || []).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showEnrollButton={false}
                />
              ))
            )}
          </div> */}
        </div>
        <div className="hidden lg:block w-full h-full max-w-[424px]">
          {/* <Card className="border border-transparent dark:border-default-100 h-full w-full bg-background">
            <CardBody className="w-full">
              <div>
               
              </div>
              <div className="w-full">
                <div className="flex justify-center pt-8">
                  <Avatar size="lg" />
                </div>
                <div className="pt-2 w-full text-nowrap">
                  <Skeleton
                    className="font-semibold text-2xl capitalize text-center h-8 rounded-lg w-32 m-auto"
                    isLoaded={!isUserLoading}
                  >
                    <p className="font-semibold text-2xl capitalize text-center">
                      {user?.firstName + " " + user?.lastName}
                    </p>
                  </Skeleton>
                  <div className="pt-4 w-full">
                    <Suspense
                      fallback={
                        <Skeleton className="rounded-lg" isLoaded={false} />
                      }
                    >
                      <Skeleton className="rounded-lg" isLoaded={true}>
                        <ActivityChart />
                      </Skeleton>
                    </Suspense>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card> */}
        </div>
      </div>
    </>
  );
}
