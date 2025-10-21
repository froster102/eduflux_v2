import { PaymentStatus } from '@payment/entity/enum/PaymentStatus';
import { PaymentType } from '@payment/entity/enum/PaymentType';
import { z } from 'zod/v4';

export const paymentFilterSchema = z.object({
  filter: z
    .object({
      status: z.enum(Object.values(PaymentStatus)).optional(),
      type: z.enum(Object.values(PaymentType)).optional(),
      referenceId: z.string().optional(),
    })
    .optional(),
});
