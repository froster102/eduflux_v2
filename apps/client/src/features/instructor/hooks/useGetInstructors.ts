import { useSuspenseQuery } from '@tanstack/react-query';

import { getInstructors } from '../services/instructor';

export function useGetInstructors(
  getInstructorsQueryParameters: GetInstructorsQueryParameters,
) {
  return useSuspenseQuery({
    queryKey: ['instructors', getInstructorsQueryParameters],
    queryFn: () => getInstructors(getInstructorsQueryParameters),
  });
}
