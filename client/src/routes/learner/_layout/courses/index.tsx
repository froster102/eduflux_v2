import { Divider } from "@heroui/divider";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Spinner } from "@heroui/spinner";
import { Input } from "@heroui/input";

import { useGetCourses } from "@/features/learner/courses/hooks/queries";
import { SearchIcon } from "@/components/Icons";
import CourseCard from "@/components/CourseCard";

export const Route = createFileRoute("/learner/_layout/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const { data, isLoading } = useGetCourses({
    page,
    limit,
    searchFields: ["title"],
    searchQuery,
  });

  return (
    <div className="w-full">
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
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data?.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
