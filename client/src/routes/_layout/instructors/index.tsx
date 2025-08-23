import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "@heroui/spinner";

import { useGetInstructors } from "@/features/instructor/hooks/useGetInstructors";
import InstructorCard from "@/features/instructor/components/InstructorCard";

export const Route = createFileRoute("/_layout/instructors/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: instructors, isLoading: isInstructorsLoading } =
    useGetInstructors({});

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {isInstructorsLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        instructors!.instructors.map((instructor) => (
          <InstructorCard key={instructor.id} instructor={instructor} />
        ))
      )}
    </div>
  );
}
