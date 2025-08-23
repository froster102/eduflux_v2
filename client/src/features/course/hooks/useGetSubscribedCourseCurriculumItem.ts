import { useQuery } from "@tanstack/react-query";

import { getLecture } from "../services/course";

export function useGetSubscribedCourseCurriculumItem(
  item: (CurriculumItem & { courseId: string }) | null,
) {
  return useQuery({
    queryKey: [`course-${item?.courseId}-curriculum-item-${item?.id}`],
    queryFn: async () => {
      if (!item) {
        return null;
      }
      switch (item._class) {
        case "lecture":
          return await getLecture({
            lectureId: item.id,
            courseId: item.courseId,
          });

        default:
          null;
      }
    },
  });
}
