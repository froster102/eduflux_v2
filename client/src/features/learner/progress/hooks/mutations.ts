import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  markLessonAsComplete,
  unmarkLessonAsComplete,
} from "../services/progress-services";

export function useLessonCompletionMutation(totalLessons: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markLessonAsComplete,
    onMutate: async ({ userId, courseId, sectionId, lessonId }) => {
      await queryClient.cancelQueries({
        queryKey: [`progress:${courseId}:${userId}`],
      });

      const previousProgress = queryClient.getQueryData<Progress>([
        `progress:${courseId}:${userId}`,
      ]);

      queryClient.setQueryData<Progress>(
        [`progress:${courseId}:${userId}`],
        (old) => {
          if (!old) return old;
          const updatedLessons = old.completedLessons.map((lesson) =>
            lesson.sectionId === sectionId && lesson.lessonId === lessonId
              ? { ...lesson, isCompleted: true }
              : lesson,
          );
          const lessonExists = updatedLessons.some(
            (lesson) =>
              lesson.sectionId === sectionId && lesson.lessonId === lessonId,
          );

          if (!lessonExists) {
            updatedLessons.push({
              sectionId,
              lessonId,
              isCompleted: true,
            });
          }
          const completedCount = updatedLessons.filter(
            (lesson) => lesson.isCompleted,
          ).length;
          const completionPercentage = totalLessons
            ? Math.round((completedCount / totalLessons) * 100)
            : 0;

          return {
            ...old,
            completedLessons: updatedLessons,
            completionPercentage,
          };
        },
      );

      return { previousProgress };
    },
    onError: (_err, { userId, courseId }, context) => {
      queryClient.setQueryData(
        [`progress:${courseId}:${userId}`],
        context?.previousProgress,
      );
    },
    // onSettled: (_, __, { userId, courseId }) => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["progress", userId, courseId],
    //   });
    // },
  });
}

export function useLessonCompletionUnmarkMutation(totalLessons: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unmarkLessonAsComplete,
    onMutate: async ({ userId, courseId, sectionId, lessonId }) => {
      await queryClient.cancelQueries({
        queryKey: [`progress:${courseId}:${userId}`],
      });

      const previousProgress = queryClient.getQueryData<Progress>([
        `progress:${courseId}:${userId}`,
      ]);

      queryClient.setQueryData<Progress>(
        [`progress:${courseId}:${userId}`],
        (old) => {
          if (!old) return old;
          const updatedLessons = old.completedLessons.map((lesson) =>
            lesson.sectionId === sectionId && lesson.lessonId === lessonId
              ? { ...lesson, isCompleted: false }
              : lesson,
          );
          const completedCount = updatedLessons.filter(
            (lesson) => lesson.isCompleted,
          ).length;
          const completionPercentage = totalLessons
            ? Math.round((completedCount / totalLessons) * 100)
            : 0;

          return {
            ...old,
            completedLessons: updatedLessons,
            completionPercentage,
          };
        },
      );

      return { previousProgress };
    },
    onError: (_err, { userId, courseId }, context) => {
      queryClient.setQueryData(
        [`progress:${courseId}:${userId}`],
        context?.previousProgress,
      );
    },
    // onSettled: (_, __, { userId, courseId }) => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["progress", userId, courseId],
    //   });
    // },
  });
}
