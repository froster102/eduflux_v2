import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { NavigateFunction } from "react-router";

import {
  addCourse,
  deleteCourse,
  updateCourse,
} from "../services/course-services";

export function useUpdateCourseMutaion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourse,
    onSuccess: (response) => {
      addToast({
        title: "Course update",
        description: "Course has been updated successfully",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: [`course:${response.data.id}`],
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Course update",
        description: error.response?.data?.message,
        color: "danger",
      });
    },
  });
}

export function useAddCourseMutaion(navigate: NavigateFunction) {
  return useMutation({
    mutationFn: addCourse,
    onSuccess: () => {
      addToast({
        title: "Course upload",
        description: "Course has been uploaded successfully",
      });
      navigate("/admin/courses");
    },
    onError: (error: any) => {
      addToast({
        title: "Course upload",
        description: error?.response?.data?.message,
        color: "danger",
      });
    },
  });
}

export function useDeleteCourseMutaion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourse,

    // onMutate: async (courseId) => {
    //   await queryClient.cancelQueries({ queryKey: [`courses`] });

    //   const previousCourses = queryClient.getQueryData(["courses"]);

    //   queryClient.setQueryData(["courses"], (old: any) => ({
    //     courses: old.courses.filter(
    //       (course: Course) => course.courseId !== courseId,
    //     ),
    //   }));

    //   return { previousCourses };
    // },

    onError: (_error: any, _courseId) => {
      // if (context?.previousCourses) {
      //   queryClient.setQueryData(["courses"], context.previousCourses);
      // }
      addToast({
        title: "Course deletion failed",
        description: _error.response.data.message,
        color: "danger",
      });
    },

    onSuccess: (response) => {
      addToast({
        title: "Course deleted successfully",
        description: `${response.data.title} course has been deleted successfully`,
        color: "success",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
