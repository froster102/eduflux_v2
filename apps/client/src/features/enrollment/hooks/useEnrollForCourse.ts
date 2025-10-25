import { useMutation } from '@tanstack/react-query';

import { enrollForCourse } from '../service/enrollment';

export function useEnrollForCourse() {
  return useMutation({
    mutationFn: enrollForCourse,
  });
}
