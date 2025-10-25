import { IMAGE_BASE_URL } from '@/config/image';

export function useContructImageUrl(key: string) {
  return `${IMAGE_BASE_URL}${key}`;
}
