import api from '@/lib/axios';
import { buildJsonApiQueryString } from '@/utils/helpers';

export async function getInstructorPayments(
  queryParams?: GetPaymentQueryParameters,
): Promise<GetPaymentQueryResult> {
  let queryString = '';

  if (queryParams) {
    queryString = buildJsonApiQueryString(queryParams);
  }
  const response = await api.get(`/payments/me${queryString}`);

  return response.data;
}

export async function getPayments(
  queryParams?: GetPaymentQueryParameters,
): Promise<GetPaymentQueryResult> {
  let queryString = '';

  if (queryParams) {
    queryString = buildJsonApiQueryString(queryParams);
  }
  const response = await api.get(`/payments${queryString}`);

  return response.data;
}

export async function getPaymentSummary(
  queryParams?: GetPaymentSummaryQueryParameter,
): Promise<GetPaymentSummaryResponse> {
  let queryString = '';

  if (queryParams) {
    queryString = buildJsonApiQueryString(queryParams);
  }
  const response = await api.get(`/payments/summary${queryString}`);

  return response.data;
}

export async function checkoutItem(
  data: CheckoutData,
): Promise<JsonApiResponse<CheckoutResponse>> {
  const response = await api.post(`/checkout`, data);

  return response.data;
}
