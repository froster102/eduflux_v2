import type { PaymentQueryParameters } from '@payment/repository/types/PaymentQueryParameters';
import type { PaymentSummaryGroup } from '@payment/repository/types/PaymentSummaryGroup';
import type { AuthenticatedUserDto } from '@shared/common/dto/AuthenticatedUserDto';

export interface GetPaymentSummaryPayload {
  user: AuthenticatedUserDto;
  filter?: PaymentQueryParameters['filter'] & {
    groupBy?: PaymentSummaryGroup;
    startDate?: Date;
    endDate?: Date;
  };
}
