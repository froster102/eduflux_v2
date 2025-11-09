import api from '@/lib/axios';

export async function getUploadCredentials(data: {
  fileName: string;
  resourceType: 'image' | 'video';
}): Promise<UploadCredentials> {
  const response = await api.post(`uploads/get-upload-credentials`, data);

  return response.data;
}
