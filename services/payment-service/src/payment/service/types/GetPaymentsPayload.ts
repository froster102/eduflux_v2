import type { PaymentQueryParameters } from '@payment/repository/types/PaymentQueryParameters';
import type { AuthenticatedUserDto } from '@shared/common/dto/AuthenticatedUserDto';

export type GetPaymentsPayload = {
  executor: AuthenticatedUserDto;
  query?: PaymentQueryParameters;
};
