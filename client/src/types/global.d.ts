import { SVGProps } from "react";

declare global {
  export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
  };

  export type QuizQuestion = {
    questionId: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
  };

  export type Quiz = {
    quizId: string;
    title: string;
    duration: number;
    questions: QuizQuestion[];
  };

  export type Resource = {
    resourceId: string;
    title: string;
    type: "video" | "pdf" | "url";
    url: string | File;
  };

  export type CourseStatus =
    | "draft"
    | "published"
    | "unpublished"
    | "archived"
    | "in_review"
    | "approved"
    | "rejected";

  export type Course = {
    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    categoryId: string;
    level: "beginner" | "intermediate" | "advanced";
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

  export type Asset = {
    id: string;
    provider: string;
    providerSpecificId: string;
    resourceType: null;
    accessType: string;
    originalFileName: string | null;
    duration: null;
    status: "pending";
    mediaSources: [
      {
        type: string;
        src: string;
      },
    ];
  };

  export type CurriculumItem = Chapter | Lecture;

  export type CurriculumItems = (Chapter | Lecture)[];

  export type EnrollmentStatus =
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "REFUNDED";

  export type Enrollment = {
    id: string;
    userId: string;
    courseId: string;
    status: EnrollmentStatus;
    paymentId: string | null;
    createdAt: Date;
    updatedAt: Date;
  };

  export type Session = {
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null | undefined | undefined;
    userAgent?: string | null | undefined | undefined;
    userId: string;
    id: string;
  };

  export type User = {
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    image?: string | null | undefined | undefined;
    roles: Role[];
    id: string;
  };

  export type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    bio: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
  };

  export type Role = "ADMIN" | "LEARNER" | "INSTRUCTOR";

  export type Note = {
    id: string;
    userId: string;
    color: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  };

  export type InstructorProfile = {
    id: string;
    bio: string;
    image: string;
    socialLinks: { platform: string; url: string }[];
    defaultSessionPricing: SessionPricing;
    sessionPricing: SessionPricing;
    isProfileComplete: boolean;
    isApproved: boolean;
    canProvideSessions: boolean;
    createdAt: string;
    updatedAt: string;
  } & UserProfile;

  export type SessionStatus =
    | "PENDING_PAYMENT"
    | "BOOKED"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "RESCHEDULED"
    | "NO_SHOW"
    | "INSTRUCTOR_NO_SHOW"
    | "PAYMENT_EXPIRED";

  export type InstructorSession = {
    id: string;
    instructor: User;
    availabilitySlotId: string;
    startTime: Date;
    endTime: Date;
    status: SessionStatus;
    paymentId: string | null;
    price: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
  };

  export type AvailableSlots = {
    id: slot.id;
    instructorId: slot.instructorId;
    startTime: slot.startTime;
    endTime: slot.endTime;
  };

  export type AppNotification = {
    id: string;
    userId: string;
    title: string;
    status: "read" | "unread";
    type: string;
    message: string;
    createdAt: Date;
  };

  export type CourseProgress = {
    id: string;
    completedLectures: string[];
  };

  export type GraphData = {
    label: string;
    value: string;
  };

  export type DashboardData = {
    metrics: Record<string, any>;
    graphs?: Record<string, GraphData[]>;
  };

  export type BetterAuthError = {
    code?: string | undefined;
    message?: string | undefined;
    status: number;
    statusText: string;
  };

  export type PaginationQueryParams = {
    page?: number;
    limit?: number;
    searchQuery?: string;
    searchFields?: string[];
    filters?: {
      [key: string]: string | number | boolean | string[] | number[];
    };
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };

  export type DefaultFormProps<TFormData> = {
    onSubmitHandler(data: TFormData): void;
    isPending?: boolean;
    onCancel?: () => void;
    mode?: "create" | "edit";
    initialValue?: TFormData;
    submitText?: string;
    cancelText?: string;
  };

  export type ApiErrorResponse = {
    message: string;
    code?: string;
    details?: string | Record<string, any>;
    errors?: Array<{
      field?: string;
      message: string;
      [key: string]: any;
    }>;
  };
}

export {};
