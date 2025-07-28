import { useQuery } from "@tanstack/react-query";

import { getInstructorAvailableSlots } from "../services/session";

export function useGetInstructorAvailableSlots(data: {
  instructorId: string;
  date: string;
  timeZone: string;
}) {
  return useQuery({
    queryKey: [`instructor-${data.instructorId}-date-${data.date}-slots`],
    queryFn: () => getInstructorAvailableSlots(data),
  });
}
