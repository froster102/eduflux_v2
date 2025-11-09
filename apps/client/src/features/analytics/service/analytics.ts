import api from '@/lib/axios';

export async function getApplicationStats(): Promise<
  JsonApiResponse<ApplicationStats>
> {
  const response = await api.get('/analytics/application-stats');

  return response.data;
}

export interface UserGrowthData {
  month: string;
  users: number;
}

export async function getUserGrowth(): Promise<
  JsonApiResponse<UserGrowthData[]>
> {
  const response = await api.get('/analytics/user-growth');

  return response.data;
}
