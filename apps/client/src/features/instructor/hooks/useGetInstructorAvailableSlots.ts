import { useQuery } from '@tanstack/react-query';

import { getInstructorAvailableSlots } from '../services/instructor';

export function useGetInstructorAvailableSlots(data: {
  instructorId: string;
  queryParams: AvailabilitySlotQueryParameters;
}) {
  return useQuery({
    queryKey: [`instructor-slots`, data.queryParams],
    queryFn: () => getInstructorAvailableSlots(data),
  });
}
