import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/store/auth-store';

import { addCourseProgress } from '../service/progress';

export function useAddCourseProgress() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCourseProgress,

    onMutate: async ({ courseId, lectureId }) => {
      const key = `user-${user!.id}-course-${courseId}-progress`;

      await queryClient.cancelQueries({
        queryKey: [key],
      });

      const prev = queryClient.getQueryData([key]);

      queryClient.setQueryData(
        [key],
        (
          old: JsonApiResponse<CourseProgress>,
        ): JsonApiResponse<CourseProgress> => ({
          ...old,
          data: {
            ...old.data,
            completedLectures: [...old.data.completedLectures, lectureId],
          },
        }),
      );

      return { prev };
    },

    onError: (_err, { courseId }, context) => {
      const key = `user-${user!.id}-course-${courseId}-progress`;

      queryClient.setQueryData([key], context?.prev);
    },
  });
}
