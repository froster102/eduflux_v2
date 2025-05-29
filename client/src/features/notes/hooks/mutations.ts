import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { createNote, deleteNote, updateNote } from "../services/note-services";

export function useAddNoteMutation(queryParams: QueryParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", queryParams] });
    },
  });
}

export function useUpdateNoteMutation(queryParams: QueryParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNote,

    onMutate: async ({ id, content }: { id: string; content: string }) => {
      await queryClient.cancelQueries({ queryKey: ["notes", queryParams] });
      const previousNotes = queryClient.getQueryData(["notes", queryParams]);

      queryClient.setQueryData(
        ["notes", queryParams],
        (old: { totalCount: number; notes: Note[] }) => {
          if (!old) return old;
          const updatedNote = old.notes.map((note) =>
            note.id === id ? { ...note, content } : note,
          );

          return { ...old, notes: updatedNote };
        },
      );

      return { previousNotes };
    },

    onError: (_error, _id, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes", queryParams], context.previousNotes);
      }

      addToast({
        title: "Add note",
        description: "Failed to delete note, please try again later",
        color: "danger",
      });
    },
  });
}

export function useDeleteNoteMutation(queryParams: QueryParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notes", queryParams] });
      const previousNotes = queryClient.getQueryData(["notes", queryParams]);

      queryClient.setQueryData(
        ["notes", queryParams],
        (old: { totalCount: number; notes: Note[] }) => {
          if (!old) return old;
          const updatedNote = old.notes.filter((note) => note.id !== id);

          return { ...old, notes: updatedNote };
        },
      );

      return { previousNotes };
    },

    onError: (_error, _id, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes", queryParams], context.previousNotes);
      }

      addToast({
        title: "Add note",
        description: "Failed to delete note, please try again later",
        color: "danger",
      });
    },
  });
}
