export interface CreateLecturePayload {
  courseId: string;
  title: string;
  description: string;
  preview: boolean;
  sortOrder: number;
  objectIndex: number;
}
