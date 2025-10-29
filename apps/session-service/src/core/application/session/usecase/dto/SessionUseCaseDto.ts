import { Session } from '@core/domain/session/entity/Session';
import { SessionStatus } from '@eduflux-v2/shared/constants/SessionStatus';

export class SessionUseCaseDto {
  readonly id: string;
  readonly instructorId: string;
  readonly learnerId: string;
  readonly availabilitySlotId: string;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly status: SessionStatus;
  readonly paymentId: string | null;
  readonly pendingPaymentExpiryTime: Date | null;
  readonly price: number;
  readonly currency: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(session: Session) {
    this.id = session.id;
    this.instructorId = session.instructorId;
    this.learnerId = session.learnerId;
    this.availabilitySlotId = session.availabilitySlotId;
    this.startTime = session.startTime;
    this.endTime = session.endTime;
    this.status = session.status;
    this.paymentId = session.paymentId;
    this.pendingPaymentExpiryTime = session.pendingPaymentExpiryTime;
    this.price = session.price;
    this.currency = session.currency;
    this.createdAt = session.createdAt;
    this.updatedAt = session.updatedAt;
  }

  static fromEntity(session: Session): SessionUseCaseDto {
    return new SessionUseCaseDto(session);
  }

  static fromEntities(sessions: Session[]): SessionUseCaseDto[] {
    return sessions.map((session) => this.fromEntity(session));
  }
}
