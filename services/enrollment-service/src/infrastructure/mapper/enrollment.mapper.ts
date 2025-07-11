import { Enrollment } from '@/domain/enitites/enrollment.entity';
import { IMapper } from './interface/mapper.interface';
import { IEnrollment } from '../database/schema/enrollment.schema';

export class EnrollmentMapper implements IMapper<Enrollment, IEnrollment> {
  toDomain(raw: IEnrollment): Enrollment {
    return Enrollment.fromPersistence({
      id: (raw._id as string).toString(),
      userId: raw.userId,
      courseId: raw.courseId,
      status: raw.status,
      paymentId: raw.paymentId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(raw: Enrollment): Partial<IEnrollment> {
    return {
      _id: raw.id,
      userId: raw.userId,
      courseId: raw.courseId,
      status: raw.status,
      paymentId: raw.paymentId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  toDomainArray(raw: IEnrollment[]): Enrollment[] {
    return raw.map((r) => this.toDomain(r));
  }
}
