import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import {
  createChapter,
  createCourse,
  createLecture,
  deleteChapter,
  deleteLecture,
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
