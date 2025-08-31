import type { Enrollment } from '@core/domain/enrollment/entity/Enrollment';

export class EnrollmentUseCaseDto {
  readonly id: string;
  readonly userId: string;
  readonly courseId: string;
  readonly status: string;
  readonly paymentId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(enrollment: Enrollment) {
    this.id = enrollment.id;
    this.userId = enrollment.userId;
    this.courseId = enrollment.courseId;
    this.status = enrollment.status;
    this.paymentId = enrollment.paymentId;
    this.createdAt = enrollment.createdAt;
    this.updatedAt = enrollment.updatedAt;
  }

  static fromEntity(enrollment: Enrollment): EnrollmentUseCaseDto {
    return new EnrollmentUseCaseDto(enrollment);
  }

  static fromEntities(enrollments: Enrollment[]): EnrollmentUseCaseDto[] {
    return enrollments.map((enrollment) => this.fromEntity(enrollment));
  }
}
