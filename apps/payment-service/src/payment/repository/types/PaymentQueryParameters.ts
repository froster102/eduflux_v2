import type { PaymentStatus } from '@payment/entity/enum/PaymentStatus';
import type { PaymentType } from '@payment/entity/enum/PaymentType';
import type { PaginationQueryParameters } from '@shared/common/port/persistence/types/PaginationQueryParameters';

export interface PaymentQueryParameters extends PaginationQueryParameters {
  filter?: {
    status?: PaymentStatus;
    instructorId?: string;
    type?: PaymentType;
    referenceId?: string;
  };
}
