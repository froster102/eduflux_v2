import api from '@/lib/axios';

export async function getNotifications(): Promise<
  JsonApiResponse<AppNotification[]>
> {
  const response = await api.get('/notifications');

  return response.data;
}

export async function markAsSeen(notificationId: string): Promise<void> {
  await api.patch(`/notifications/${notificationId}/seen`);
}
