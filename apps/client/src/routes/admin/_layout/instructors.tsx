import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

import { useGetInstructors } from '@/features/instructor/hooks/useGetInstructors';
import InstructorsTable from '@/features/admin/components/InstructorsTable';

export const Route = createFileRoute('/admin/_layout/instructors')({
  component: RouteComponent,
});

function RouteComponent() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [search, setSearch] = React.useState('');

  const { data: result, isLoading: isInstructorsLoading } = useGetInstructors({
    page: {
      number: page,
      size: pageSize,
    },
    filter: {
      isSchedulingEnabled: false,
      name: search || undefined,
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Instructors</h1>
      <InstructorsTable
        instructors={result?.data ?? []}
        isLoading={isInstructorsLoading}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        totalCount={result?.meta.totalCount ?? 0}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />
    </div>
  );
}
