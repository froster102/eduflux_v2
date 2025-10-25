import { useMutation } from '@tanstack/react-query';

import { createLecture } from '../services/course';

export function useCreateLecture() {
  return useMutation({
    mutationFn: createLecture,
  });
}
