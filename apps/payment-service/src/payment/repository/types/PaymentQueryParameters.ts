import type { PaymentStatus } from '@payment/entity/enum/PaymentStatus';
import type { PaymentType } from '@payment/entity/enum/PaymentType';
import type { PaginationQueryParams } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';

export interface PaymentQueryParameters extends PaginationQueryParams {
  filter?: {
    status?: PaymentStatus;
    instructorId?: string;
    type?: PaymentType;
    referenceId?: string;
  };
}
