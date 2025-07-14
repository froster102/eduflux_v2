import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Spinner } from "@heroui/spinner";
import { Tab, Tabs } from "@heroui/tabs";
import { Pagination } from "@heroui/pagination";
import { Button } from "@heroui/button";

import { useGetCourses } from "@/features/learner/courses/hooks/queries";
import CourseCard from "@/components/CourseCard";

export const Route = createFileRoute("/learner/_layout/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(8);

  const { data, isLoading } = useGetCourses({
    page,
    limit,
    searchFields: ["title"],
    searchQuery,
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="w-full">
      <div>
        <Tabs
          key={"key"}
          aria-label="Tabs variants"
          className="pt-2"
          variant="underlined"
        >
          <Tab key="all_courses" title="All course" />
          <Tab key="my_courses" title="My courses" />
        </Tabs>
      </div>
      <div className="w-full h-full pt-4">
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data?.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            <div className="pt-4 flex w-full justify-center">
              <>
                <Button
                  className="mr-2"
                  color="primary"
                  isDisabled={page === 1}
                  size="sm"
                  variant="flat"
                  onPress={() =>
                    setPage((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                >
                  Previous
                </Button>
                <Pagination
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
                />
                <Button
                  className="ml-2"
                  color="primary"
                  isDisabled={page >= totalPages}
                  size="sm"
                  variant="flat"
                  onPress={() =>
                    setPage((prev) => (prev < totalPages ? prev + 1 : prev))
                  }
                >
                  Next
                </Button>
              </>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
