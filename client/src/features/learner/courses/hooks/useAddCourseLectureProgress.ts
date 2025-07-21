import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addCourseLectureProgress } from "../services/course";

import { useAuthStore } from "@/store/auth-store";

export function useAddCourseLectureProgress() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCourseLectureProgress,

    onMutate: async ({ courseId, lectureId }) => {
      const key = `user-${user!.id}-course-${courseId}-progress`;

      await queryClient.cancelQueries({
        queryKey: [key],
      });

      const prev = queryClient.getQueryData([key]);

      queryClient.setQueryData([key], (old: CourseProgress) => ({
        ...old,
        completedLectures: [...old.completedLectures, lectureId],
      }));

      return { prev };
    },

    onError: (_err, { courseId }, context) => {
      const key = `user-${user!.id}-course-${courseId}-progress`;

      queryClient.setQueryData([key], context?.prev);
    },
  });
}
