import { createFileRoute } from '@tanstack/react-router';
import { Spinner } from '@heroui/spinner';
import React from 'react';

import InstructorCard from '@/features/instructor/components/InstructorCard';
import SearchBox from '@/components/SearchBox';
import { useGetInstructors } from '@/features/instructor/hooks/useGetInstructors';
import PaginationWithNextAndPrevious from '@/components/Pagination';

export const Route = createFileRoute('/_layout/instructors/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [page, setPage] = React.useState<number>(1);
  const { data: result, isLoading: isInstructorsLoading } = useGetInstructors({
    page: {
      number: page,
    },
    filter: {
      isSchedulingEnabled: true,
    },
  });

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
          result.data.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))
        )}
      </div>
      <div className="pt-4 flex w-full justify-center">
        {result.meta.totalPages > 1 && (
          <PaginationWithNextAndPrevious
            currentPage={result.meta.pageNumber}
            totalPages={result.meta.totalPages}
            onPageChange={(page) => setPage(page)}
          />
        )}
      </div>
    </div>
  );
}
