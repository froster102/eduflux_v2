import { Divider } from "@heroui/divider";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Spinner } from "@heroui/spinner";
import { Input } from "@heroui/input";

import { useGetPublishedCourses } from "@/features/learner/courses/hooks/queries";
import CourseCard from "@/components/CourseCard";
import { SearchIcon } from "@/components/Icons";

export const Route = createFileRoute("/learner/_layout/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);

  const { data, isLoading } = useGetPublishedCourses({
    page,
    limit,
    searchFields: ["title"],
    searchQuery,
  });

  return (
    <div>
      <div>
        <p className="text-3xl font-bold">Courses</p>
        <small className="text-sm text-default-500">
          Below are the list of courses
        </small>
      </div>
      <div className="py-4">
        <Divider />
      </div>
      <div>
        <Input
          isClearable
          className="w-full max-w-md"
          color="default"
          placeholder={`Search`}
          startContent={<SearchIcon />}
          // onValueChange={debouncedSetSearchQuery}
        />
      </div>
      <div className="w-full h-full pt-4">
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className="gap-4 flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 pt-8">
            {data &&
              data.courses.map((course) => (
                <div key={course.id} className="max-w-xs">
                  <CourseCard course={course} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
