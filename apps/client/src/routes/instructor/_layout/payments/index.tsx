import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

import { useAuthStore } from '@/store/auth-store';
import { useGetInstructorPayments } from '@/features/payment/hooks/useGetInstructorPayments';
import { PaymentType } from '@/shared/enums/PaymentType';
import { useGetPaymentSummary } from '@/features/payment/hooks/useGetPaymentSummary';
import { PaymentSummaryGroup } from '@/shared/enums/PaymentSummaryGroup';
import { mapPaymentSummaryToChartData } from '@/utils/helpers';
import TotalEarningCard from '@/features/payment/components/TotalEarningCard';
import PaymentsGraph from '@/features/payment/components/PaymentsGraph';
import PaymentsTable from '@/features/payment/components/PaymentsTable';

export const Route = createFileRoute('/instructor/_layout/payments/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [instructorPaymentFilters, setInstructorPaymentFilters] =
    React.useState<GetPaymentQueryParameters>({
      page: {
        number: page,
        size: pageSize,
      },
    });
  const { data: instructorPayments, isPending: isPaymentsPending } =
    useGetInstructorPayments(instructorPaymentFilters);
  const [paymentSummaryFilters, setPaymentSummaryFilters] = React.useState<
    GetPaymentSummaryQueryParameter['filter']
  >({
    groupBy: PaymentSummaryGroup.MONTH,
    type: PaymentType.COURSE_PURCHASE,
  });

  const { data: paymentSummary } = useGetPaymentSummary({
    filter: paymentSummaryFilters,
  });

  const graphData = mapPaymentSummaryToChartData(
    paymentSummary?.data.summary ?? [],
    paymentSummaryFilters?.groupBy,
  );

  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full">
      <div className="flex flex-col lg:flex-row gap-4">
        <TotalEarningCard
          earning={paymentSummary?.data.totalInstructorRevenue!}
          userName={user!.name}
        />

        {paymentSummaryFilters && (
          <PaymentsGraph
            graphData={graphData}
            setType={(type) =>
              setPaymentSummaryFilters((prev) => ({ ...prev, type }))
            }
            type={paymentSummaryFilters.type! ?? PaymentType.COURSE_PURCHASE}
          />
        )}
      </div>

      <div className="pt-0-4">
        <PaymentsTable
          isLoading={isPaymentsPending}
          page={page}
          pageSize={pageSize}
          payments={instructorPayments?.data.payments ?? []}
          setPage={setPage}
          setPageSize={setPageSize}
          onSearchValueChange={(value) => {
            setInstructorPaymentFilters((prev) => ({
              ...prev,
              filter: { ...prev.filter, referenceId: value },
            }));
          }}
        />
      </div>
    </div>
  );
}
