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

  export type Lesson = {
    id: string;
    title: string;
    description: string;
    video: string | File;
    preview: boolean;
  };

  export type Section = {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
  };

  export type Course = {
    id: string;
    title: string;
    description: string;
    thumbnail: string | File;
    difficulty: "beginner" | "intermediate" | "advanced";
    status: "draft" | "published";
    sections: Section[];
    totalEnrollments?: number;
    createdBy: string;
    processing: boolean;
  };

  export type ErrorResponse = {
    status: string;
    message: string;
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
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined | undefined;
    roles: Role[];
    id: string;
  };

  export type Student = {
    id: string;
    userId: string;
    enrolledCourses: string[];
    user?: User;
    enrollments?: Enrollment[];
  };

  export type Tutor = {
    id: string;
    userId: string;
    lastName: string;
    courses: string[];
    user?: User;
  };

  export type QueryParams = {
    searchKey?: string;
    searchQuery?: string;
    page?: number;
    pageSize?: number;
    filters?: Filter[];
  };

  export type Filter = {
    key: string;
    value: string;
  };

  export type Enrollment = {
    id: string;
    studentId: string;
    courseId: string;
    status: "approved" | "pending" | "rejected";
    requestedAt: string;
    reviewedAt: string;
    reviewedBy: string;
    reviewer?: User;
    student?: Student;
  };

  export type Role = "ADMIN" | "STUDENT" | "INSTRUCTOR";

  export type Note = {
    id: string;
    userId: string;
    color: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  };

  export type StudentSession = {
    id: string;
    startTime: string;
    endTime: string;
    status: "scheduled" | "in_progress" | "completed" | "cancelled" | "failed";
    createdAt: string;
    updatedAt: string;
    tutorId: string;
    tutor: User;
    studentId: string;
    student: User;
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

  export type Progress = {
    id: string;
    userId: string;
    courseId: string;
    completedLessons: {
      lessonId: string;
      sectionId: string;
      isCompleted: boolean;
    }[];
    completionPercentage: number;
    createdAt: Date;
    updatedAt: Date;
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
}

export {};
