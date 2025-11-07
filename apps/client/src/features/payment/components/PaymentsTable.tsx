import { Chip } from '@heroui/chip';

import DataTable from '@/components/DataTable';
import { PaymentStatus } from '@/shared/enums/PaymentStatus';
import { PaymentType } from '@/shared/enums/PaymentType';

const PaymentStatusColorMap: Record<
  PaymentStatus,
  'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
> = {
  pending: 'warning',
  completed: 'success',
  failed: 'danger',
  refunded: 'secondary',
};

interface PaymentsTableProps {
  payments: Payment[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  onSearchValueChange: (value: string) => void;
  totalCount?: number;
}

export default function PaymentsTable({
  payments,
  isLoading,
  page,
  pageSize,
  setPage,
  setPageSize,
  onSearchValueChange,
  totalCount,
}: PaymentsTableProps) {
  const PaymentTypeMap: Record<PaymentType, string> = {
    course_purchase: 'Course Purchase',
    session_booking: 'Session Booking',
  };

  const columns = [
    { uid: 'referenceId', name: 'Reference ID' },
    { uid: 'platformFee', name: 'Platform Fee', sortable: true },
    { uid: 'instructorRevenue', name: 'Instructor Revenue', sortable: true },
    // { uid: "status", name: "Status" },
    { uid: 'createdAt', name: 'Payment Date', sortable: true },
    { uid: 'type', name: 'Payment Type', sortable: true },
  ];

  const renderCell = (item: Payment, columnKey: string) => {
    switch (columnKey) {
      case 'referenceId':
        return item.referenceId;
      case 'platformFee':
        return `$${item.platformFee.toFixed(2)}`;
      case 'instructorRevenue':
        return `$${item.instructorRevenue.toFixed(2)}`;
      case 'status':
        return (
          <Chip color={PaymentStatusColorMap[item.status]}>{item.status}</Chip>
        );
      case 'createdAt':
        return new Date(item.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      case 'type':
        return PaymentTypeMap[item.type];
      default:
        return '';
    }
  };

  return (
    <DataTable
      columns={columns}
      data={payments}
      isLoading={isLoading}
      keyProp="id"
      page={page}
      pageSize={pageSize}
      renderCell={renderCell}
      searchKey="referenceId"
      tableName="Payments"
      totalCount={totalCount ?? payments.length}
      onPaginationChange={setPage}
      onRowsPerPageChange={(rows) => {
        setPageSize(rows);
        setPage(1);
      }}
      onSeachValueChange={onSearchValueChange}
    />
  );
}
