import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import {
  assignCourse,
  blockUser,
  createTutor,
  removeCourse,
  unblockUser,
  unEnrollCourse,
} from "../services/user-services";

export function useCreateTutorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTutor,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Oops something wrong with your request";

      addToast({
        title: "Tutor creation failed",
        description: errorMessage,
        color: "danger",
      });
    },
  });
}

export function useBlockUserMutaion(queryParams: QueryParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blockUser,

    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({ queryKey: ["users", queryParams] });
      const previousUsers = queryClient.getQueryData(["users", queryParams]);

      queryClient.setQueryData(
        ["users", queryParams],
        (old: { totalCount: number; users: User[] }) => {
          if (!old) return old;
          const newUsers = old.users.map((user) =>
            user.id === userId ? { ...user, isActive: false } : user,
          );

          return { ...old, users: newUsers };
        },
      );

      return { previousUsers };
    },

    onError: (_error, _userId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users", queryParams], context.previousUsers);
      }

      addToast({
        title: "Block User",
        description: "Failed to block user",
        color: "danger",
      });
    },

    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["users"] });
    // },
  });
}

export function useUnblockUserMutation(queryParams: QueryParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unblockUser,

    onMutate: async (userId: string) => {
      await queryClient.cancelQueries({ queryKey: ["users", queryParams] });
      const previousUsers = queryClient.getQueryData(["users", queryParams]);

      queryClient.setQueryData(
        ["users", queryParams],
        (old: { totalCount: number; users: User[] }) => {
          if (!old) return old;
          const newUsers = old.users.map((user) =>
            user.id === userId ? { ...user, isActive: true } : user,
          );

          return { ...old, users: newUsers };
        },
      );

      return { previousUsers };
    },

    onError: (_error, _userId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users", queryParams], context.previousUsers);
      }

      addToast({
        title: "Block User",
        description: "Failed to block user",
        color: "danger",
      });
    },

    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["users"] });
    // },
  });
}

export function useUnEnrollCourseMutation(queryParams: QueryParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unEnrollCourse,

    onMutate: async ({ courseId }: { userId: string; courseId: string }) => {
      await queryClient.cancelQueries({
        queryKey: ["studentEnrolledCourses", queryParams],
      });
      const previousCourses = queryClient.getQueryData([
        "studentEnrolledCourses",
        queryParams,
      ]);

      queryClient.setQueryData(
        ["studentEnrolledCourses", queryParams],
        (old: { total: number; courses: Course[] }) => {
          if (!old || !old.courses) return old;
          const newCourses = old.courses.filter(
            (course) => course.id !== courseId,
          );

          return { ...old, courses: newCourses, total: old.total - 1 };
        },
      );

      return { previousCourses };
    },

    onError: (error: any, _userId, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(
          ["studentEnrolledCourses", queryParams],
          context.previousCourses,
        );
      }

      const errorMessage =
        error.response.data.message || "Failed to unenroll student from course";

      addToast({
        title: "Course Unenrollment",
        description: errorMessage,
        color: "danger",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useAssignCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      courseId,
    }: {
      userId: string;
      courseId: string;
    }) => {
      const response = await assignCourse({ userId, courseId });

      return response.data;
    },

    onError: (error: any, _userId) => {
      const errorMessage =
        error.response.data.message || "Failed to assign course to tutor";

      addToast({
        title: "Course Assignment",
        description: errorMessage,
        color: "danger",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useRemoveCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      courseId,
    }: {
      userId: string;
      courseId: string;
    }) => {
      const response = await removeCourse({ userId, courseId });

      return response.data;
    },

    onError: (error: any, _userId) => {
      const errorMessage =
        error.response.data.message || "Failed to remove course ";

      addToast({
        title: "Course Removal",
        description: errorMessage,
        color: "danger",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
