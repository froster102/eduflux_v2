import api from "@/lib/axios";

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
