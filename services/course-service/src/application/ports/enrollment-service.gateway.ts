import { PaginationQueryParams } from '../dto/pagination.dto';

export type EnrollmentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface EnrollmentDto {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetUserEnrollmentsResponseDto {
  enrollments: EnrollmentDto[];
  total: number;
}

export interface IEnrollmentServiceGateway {
  getUserEnrollments(
    userId: string,
    paginationQueryParams: PaginationQueryParams,
  ): Promise<GetUserEnrollmentsResponseDto>;
  checkUserEnrollment(
    userId: string,
    courseId: string,
  ): Promise<{ isEnrolled: boolean }>;
}
