import api from "@/lib/axios";

export async function getDataboardData(period?: "weekly" | "monthly") {
  const response = await api.get<DashboardData>(
    `/analytics/admin${period ? `?period=${period}` : ""}`,
  );

  return response.data;
}
