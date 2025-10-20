import api from "@/lib/axios";
import { buildJsonApiQueryString } from "@/utils/helpers";

export async function createStripeChekoutSession({
  type,
  referenceId,
}: {
  type: string;
  referenceId: string;
}): Promise<JsonApiResponse<{ clientSecret: string; checkoutUrl: string }>> {
  const response = await api.post(`/payments/checkout/${type}/${referenceId}`);

  return response.data;
}

export async function getInstructorPayments(
  queryParams?: GetPaymentQueryParameters,
): Promise<GetPaymentQueryResult> {
  let queryString = "";

  if (queryParams) {
    queryString = buildJsonApiQueryString(queryParams);
  }
  const response = await api.get(`/payments/me${queryString}`);

  return response.data;
}

export async function getPayments(
  queryParams?: GetPaymentQueryParameters,
): Promise<GetPaymentQueryResult> {
  let queryString = "";

  if (queryParams) {
    queryString = buildJsonApiQueryString(queryParams);
  }
  const response = await api.get(`/payments${queryString}`);

  return response.data;
}

export async function getPaymentSummary(
  queryParams?: GetPaymentSummaryQueryParameter,
): Promise<GetPaymentSummaryResponse> {
  let queryString = "";

  if (queryParams) {
    queryString = buildJsonApiQueryString(queryParams);
  }
  const response = await api.get(`/payments/summary${queryString}`);

  return response.data;
}
