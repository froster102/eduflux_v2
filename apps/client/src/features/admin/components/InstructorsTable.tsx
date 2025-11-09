import { Chip } from '@heroui/chip';
import { Avatar } from '@heroui/avatar';

import DataTable from '@/components/DataTable';
import { IMAGE_BASE_URL } from '@/config/image';

interface InstructorsTableProps {
  instructors: Instructor[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  onSearchChange: (value: string) => void;
  totalCount: number;
}

export default function InstructorsTable({
  instructors,
  isLoading,
  page,
  pageSize,
  setPage,
  setPageSize,
  onSearchChange,
  totalCount,
}: InstructorsTableProps) {
  const columns = [
    { uid: 'name', name: 'Name', sortable: true },
    { uid: 'bio', name: 'Bio' },
    { uid: 'totalCourses', name: 'Courses', sortable: true },
    { uid: 'totalLearners', name: 'Learners', sortable: true },
    { uid: 'sessionsConducted', name: 'Sessions', sortable: true },
    { uid: 'isSessionEnabled', name: 'Session Enabled' },
  ];

  const renderCell = (instructor: Instructor, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return (
          <div className="flex items-center gap-3">
            <Avatar
              isBordered
              radius="md"
              size="sm"
              src={
                instructor.profile.image
                  ? `${IMAGE_BASE_URL}${instructor.profile.image}`
                  : undefined
              }
            />
            <span className="font-medium">{instructor.profile.name}</span>
          </div>
        );
      case 'bio':
        return (
          <p className="text-sm text-default-600 line-clamp-2 max-w-md">
            {instructor.profile.bio || '-'}
          </p>
        );
      case 'totalCourses':
        return <span>{instructor.totalCourses}</span>;
      case 'totalLearners':
        return <span>{instructor.totalLearners.toLocaleString()}</span>;
      case 'sessionsConducted':
        return <span>{instructor.sessionsConducted}</span>;
      case 'isSessionEnabled':
        return (
          <Chip
            color={
              instructor.pricing.isSchedulingEnabled ? 'success' : 'default'
            }
            size="sm"
            variant="flat"
          >
            {instructor.pricing.isSchedulingEnabled ? 'Enabled' : 'Disabled'}
          </Chip>
        );
      default:
        return '';
    }
  };

  return (
    <DataTable
      columns={columns}
      data={instructors}
      isLoading={isLoading}
      keyProp="id"
      page={page}
      pageSize={pageSize}
      renderCell={renderCell}
      searchKey="name"
      tableName="Instructors"
      totalCount={totalCount}
      onPaginationChange={setPage}
      onRowsPerPageChange={(rows) => {
        setPageSize(rows);
        setPage(1);
      }}
      onSeachValueChange={onSearchChange}
    />
  );
}
