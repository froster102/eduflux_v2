import type { PaymentQueryParameters } from '@payment/repository/types/PaymentQueryParameters';
import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export type GetPaymentsPayload = {
  executor: AuthenticatedUserDto;
  query?: PaymentQueryParameters;
};
