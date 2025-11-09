export interface NewLecturePayload {
  id: string;
  courseId: string;
  title: string;
  description: string;
  assetId: string | null;
  preview: boolean;
  sortOrder: number;
  objectIndex: number;
}
