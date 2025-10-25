import { useMutation } from '@tanstack/react-query';

import { updateChapter } from '../services/course';

export function useUpdateChapter() {
  return useMutation({
    mutationFn: updateChapter,
  });
}
