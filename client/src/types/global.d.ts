import { SVGProps } from "react";

declare global {
  export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
  };

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

  export type Pagination = {
    totalPages: number;
    currentPage: number;
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

  export type BetterAuthError = {
    code?: string | undefined;
    message?: string | undefined;
    status: number;
    statusText: string;
  };

  export type QueryParmeters = {
    page?: number;
    limit?: number;
    search?: string;
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
