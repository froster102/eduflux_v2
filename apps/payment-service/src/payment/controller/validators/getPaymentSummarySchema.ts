import { paymentFilterSchema } from '@payment/controller/validators/paymentFilterSchema';
import { PaymentSummaryGroup } from '@payment/repository/types/PaymentSummaryGroup';
import { z } from 'zod/v4';

export const getPaymentSummarySchema = z.object({
  ...paymentFilterSchema.shape,
  startDate: z.iso.datetime({ offset: true }).optional(),
  endDate: z.iso.datetime({ offset: true }).optional(),
  paymentSummaryGroup: z
    .enum(PaymentSummaryGroup)
    .default(PaymentSummaryGroup.MONTH),
});
