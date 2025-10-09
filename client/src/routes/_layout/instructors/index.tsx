import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "@heroui/spinner";

import InstructorCard from "@/features/instructor/components/InstructorCard";
import SearchBox from "@/components/SearchBox";
import { useGetInstructors } from "@/features/instructor/hooks/useGetInstructors";

export const Route = createFileRoute("/_layout/instructors/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: result, isLoading: isInstructorsLoading } = useGetInstructors(
    {},
  );

  return (
    <div className="">
      <SearchBox placeholder="Search by instructor name" />
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-2 pt-4">
        {isInstructorsLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          result &&
          result.instructors.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))
        )}
      </div>
    </div>
  );
}
