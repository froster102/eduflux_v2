import { useMutation } from '@tanstack/react-query';

import { updateLecture } from '../services/course';

export function useUpdateLecture() {
  return useMutation({
    mutationFn: updateLecture,
  });
}
