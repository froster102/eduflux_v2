import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { AxiosError } from "axios";

import {
  addAssetToLecture,
  createChapter,
  createCourse,
  createLecture,
  deleteChapter,
  deleteLecture,
  publishCourse,
  updateChapter,
  updateCurriculumItems,
  updateLecture,
} from "../services/course";

export function useUpdateCurriculumItems() {
  return useMutation({
    mutationFn: updateCurriculumItems,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
    },
  });
}

export function useCreateChapter() {
  return useMutation({
    mutationFn: createChapter,

    onError: () => {
      addToast({
        title: "Chapter creation",
        description: "Failed to create chapter",
        color: "danger",
      });
    },
  });
}

export function useUpdateChapter() {
  return useMutation({
    mutationFn: updateChapter,
    onError: () => {
      addToast({
        title: "Chapter updation",
        description: "Failed to update chapter",
        color: "danger",
      });
    },
  });
}

export function useDeleteChapter() {
  return useMutation({
    mutationFn: deleteChapter,
    onError: () => {
      addToast({
        title: "Chapter deletion",
        description: "Failed to delete chapter",
        color: "danger",
      });
    },
  });
}

export function useCreateLecture() {
  return useMutation({
    mutationFn: createLecture,
    onError: () => {
      addToast({
        title: "Lecture creation",
        description: "Failed to create lecture",
        color: "danger",
      });
    },
  });
}

export function useUpdateLecture() {
  return useMutation({
    mutationFn: updateLecture,
    onError: () => {
      addToast({
        title: "Lecture updation",
        description: "Failed to update lecture",
      });
    },
  });
}

export function useDeleteLecture() {
  return useMutation({
    mutationFn: deleteLecture,
    onError: () => {
      addToast({
        title: "Lecture deletion",
        description: "Failed to delete lecture",
      });
    },
  });
}

export function useAddContentToLecture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAssetToLecture,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`${variables.courseId}-instructor-curriculum`],
      });
    },
    onError: () => {
      addToast({
        title: "Content upload",
        description: "Failed to content to lecture",
        color: "danger",
      });
    },
  });
}

export function usePublishCourse(options?: {
  onError: (errorMessage: string) => void;
}) {
  return useMutation({
    mutationFn: publishCourse,

    onError: (error: AxiosError<Record<string, any>>) => {
      if (options?.onError) {
        options.onError(error.response?.data.message);
      }
    },

    onSuccess: () => {
      addToast({
        title: "Course published",
        description: "Your course has been successfully published",
        color: "success",
      });
    },
  });
}
