import api from "@/lib/axios";

export function getNotes(queryParams: QueryParams) {
  const { page, pageSize, searchKey, searchQuery } = queryParams;
  const params: Record<string, any> = {
    searchQuery,
    page,
    pageSize,
    searchKey,
  };

  Object.keys(queryParams).forEach((key) =>
    params[key] === "undefined" || params[key] === null
      ? delete params[key]
      : {},
  );

  return api.get<{ totalCount: number; notes: Note[] }>("/notes", { params });
}

export function createNote({
  content,
  color,
}: {
  content: string;
  color: string;
}) {
  return api.post<Note>("/notes", { content, color });
}

export function updateNote({ id, content }: { id: string; content: string }) {
  return api.put<Note>(`/notes/${id}`, { content });
}

export function deleteNote(id: string) {
  return api.delete<Note>(`/notes/${id}`);
}
