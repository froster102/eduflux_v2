import { CourseLevel } from "@/shared/enums/CourseLevel";

declare global {
  export type UpdateCourseFormData = Partial<{
    title?: string;
    description?: string;
    categoryId?: string;
    level?: CourseLevel;
    thumbnail?: string;
    price?: number;
    isFree?: boolean;
  }>;

  export type Course = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    categoryId: string;
    level: CourseLevel;
    price: number;
    isFree: boolean;
    status: CourseStatus;
    feedback: string | null;
    instructor: { id: string; name: string };
    averageRating: number;
    ratingCount: number;
    enrollmentCount: number;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    isEnrolled?: boolean;
  };

  export type Chapter = {
    assetId: boolean;
    _class: "chapter";
    id: string;
    courseId: string;
    title: string;
    description: string;
    sortOrder: number;
    objectIndex: number;
  };

  export type Lecture = {
    _class: "lecture";
    id: string;
    courseId: string;
    title: string;
    description: string;
    assetId: string | null;
    preview: boolean;
    sortOrder: number;
    objectIndex: number;
    asset?: Asset;
  };

  export type CourseStatus =
    | "draft"
    | "published"
    | "unpublished"
    | "archived"
    | "in_review"
    | "approved"
    | "rejected";

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

  export type Category = {
    id: string;
    title: string;
  };

  export type UploadCredentials = {
    uploadUrl: string;
    formFields: { [key: string]: string };
    fileKey: string;
    expiresAt?: string;
  };

  export type CurriculumItem = Chapter | Lecture;

  export type CurriculumItems = (Chapter | Lecture)[];

  export type GetSubscribedCoursesQueryParams = PaginationQueryParameters;

  export type GetInstructorCoursesResponse = JsonApiResponse<Course[]> & {
    meta: Pagination;
  };

  export type GetInstructorCourseCurriculumReponse =
    JsonApiResponse<CurriculumItems>;

  export type GetCourseCategories = JsonApiResponse<Category[]>;

  export type GetCoursesResponse = JsonApiResponse<Course[]> & {
    meta: Pagination;
  };

  export type GetSubscribedCourses = JsonApiResponse<Course[]> & {
    meta: Pagination;
  };
}

export {};
