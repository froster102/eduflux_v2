declare global {
  export type UpdateCourseFormData = Partial<{
    title: string;
    description: string;
    categoryId: string;
    level: "beginner" | "intermediate" | "advanced";
    thumbnail: string | null;
    price: unknown;
    isFree: boolean;
  }>;

  export type ChapterFormData = {
    title: string;
    description: string;
  };

  export type CreateCourseFormData = {
    title: string;
    categoryId: string;
  };

  export type LectureFormData = {
    title: string;
    description: string;
    preview: boolean;
  };

  export type UploadCredentials = {
    uploadUrl: string;
    formFields: { [key: string]: string };
    fileKey: string;
    expiresAt?: string;
  };
}

export {};
