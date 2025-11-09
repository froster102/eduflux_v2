export interface NewChapterPayload {
  id: string;
  courseId: string;
  title: string;
  description: string;
  sortOrder: number;
  objectIndex: number;
}
