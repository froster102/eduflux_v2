import { paginationSchema } from '@payment/controller/validators/paginationSchema';
import { paymentFilterSchema } from '@payment/controller/validators/paymentFilterSchema';
import { z } from 'zod/v4';

export const getPaymentsSchema = z.object({
  ...paginationSchema.shape,
  ...paymentFilterSchema.shape,
});
