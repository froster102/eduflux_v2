import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';
import type { PaymentQueryParameters } from '@payment/repository/types/PaymentQueryParameters';
import type { PaymentSummaryGroup } from '@payment/repository/types/PaymentSummaryGroup';

export interface GetPaymentSummaryPayload {
  user: AuthenticatedUserDto;
  filter?: PaymentQueryParameters['filter'] & {
    groupBy?: PaymentSummaryGroup;
    startDate?: Date;
    endDate?: Date;
  };
}
