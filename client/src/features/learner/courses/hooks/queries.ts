import { useQuery } from "@tanstack/react-query";

import {
  checkUserEnrollment,
  getCourseCurriculum,
  getCourseInfo,
  getCourses,
  getLecture,
  getSubscribedCourses,
} from "../services/course";

import { useAuthStore } from "@/store/auth-store";

export function useGetCourses(paginationQueryParams: PaginationQueryParams) {
  return useQuery({
    queryKey: ["published-courses", paginationQueryParams],
    queryFn: () => getCourses(paginationQueryParams),
  });
}

export function useGetCourseInfo(courseId: string) {
  return useQuery({
    queryKey: [`published-course-${courseId}`],
    queryFn: () => getCourseInfo(courseId),
  });
}

export function useGetPublishedCourseCurriculum(courseId: string) {
  return useQuery({
    queryKey: [`published-course-curriculum-${courseId}`],
    queryFn: () => getCourseCurriculum(courseId),
  });
}

export function useGetSubsribedCourses({
  paginationQueryParams,
  enabled,
}: {
  paginationQueryParams: PaginationQueryParams;
  enabled: boolean;
}) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-subscribed-courses`, paginationQueryParams],
    queryFn: () => getSubscribedCourses(paginationQueryParams),
    enabled,
  });
}

export function useCheckUserEnrollment(courseId: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-course-${courseId}-enrollment`],
    queryFn: () => checkUserEnrollment(courseId),
  });
}

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
