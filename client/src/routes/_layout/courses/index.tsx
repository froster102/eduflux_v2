import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import { Spinner } from "@heroui/spinner";
import { Tab, Tabs } from "@heroui/tabs";

import CoursesList from "@/features/course/components/CoursesList";
import { useGetSubsribedCourses } from "@/features/course/hooks/useGetSubsribedCourses";
import { useGetCourses } from "@/features/course/hooks/useGetCourses";

export const Route = createFileRoute("/_layout/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(8);
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = React.useState<
    "all-courses" | "my-courses"
  >("all-courses");

  const { data: subscribedCourses, isLoading: isSubscribedCoursesLoading } =
    useGetSubsribedCourses({
      paginationQueryParams: {
        page,
        limit,
        searchFields: ["title"],
        searchQuery,
      },
      enabled: currentTab === "my-courses",
    });

  const { data: allCourses, isLoading: isAllCoursesLoading } = useGetCourses({
    page,
    limit,
    searchFields: ["title"],
    searchQuery,
  });

  const currentTotal =
    currentTab === "all-courses" && !isAllCoursesLoading
      ? allCourses
      : currentTab === "my-courses" && !isSubscribedCoursesLoading
        ? subscribedCourses
        : 0;

  const totalPages = currentTotal ? Math.ceil(currentTotal.total / limit) : 0;

  const onPressHanlder = (course: Course) => {
    navigate({ to: `/courses/${course.id}` });
  };

  return (
    <div className="w-full">
      <div>
        <Tabs
          aria-label="Course Tabs"
          className="pt-2"
          variant="underlined"
          onSelectionChange={(value) => {
            setCurrentTab(value as "all-courses" | "my-courses");
          }}
        >
          <Tab key="all-courses" title="All course">
            <div className="w-full h-full pt-4">
              {isAllCoursesLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (
                <CoursesList
                  courses={allCourses!.courses}
                  currentPage={page}
                  totalPages={totalPages}
                  type="all-course"
                  onCoursePress={onPressHanlder}
                  onPageChange={(page) => setPage(page)}
                />
              )}
            </div>
          </Tab>
          <Tab key="my-courses" title="My courses">
            <div className="w-full h-full pt-4">
              {isSubscribedCoursesLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (
                <CoursesList
                  courses={subscribedCourses?.courses ?? []}
                  currentPage={page}
                  totalPages={totalPages}
                  type="my-courses"
                  onPageChange={(page) => setPage(page)}
                />
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
