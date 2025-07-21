import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { updateCourseInfo } from "../services/course";

export function useUpdateInstructorCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourseInfo,

    onMutate: async (prev) => {
      await queryClient.cancelQueries({ queryKey: [`course-${prev.id}`] });

      const previousCourseInfo = queryClient.getQueryData([
        `course-${prev.id}`,
      ]);

      queryClient.setQueryData([`course-${prev.id}`], (old: Course) => ({
        ...old,
        ...prev.updateData,
      }));

      return { previousCourseInfo };
    },

    onSuccess: () => {
      addToast({
        title: "Course updation",
        description: "Course info updated sucessfully.",
      });
    },

    onError: (_error, variables, context) => {
      queryClient.setQueryData(
        [`course-${variables.id}`],
        context?.previousCourseInfo,
      );
      addToast({
        title: "Course updation",
        description: "Failed to update course.",
      });
    },
  });
}
