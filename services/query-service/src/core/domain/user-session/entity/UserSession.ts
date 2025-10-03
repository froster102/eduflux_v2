import { Entity } from "@core/common/entity/Entity";
import type { CreateUserSessionPayload } from "@core/domain/user-session/entity/types/CreateUserSessionPayload";
import type { SessionParticipant } from "@core/domain/user-session/entity/types/SessionParticipant";
import type { SessionStatus } from "@core/domain/user-session/enum/SessionStatus";

export class UserSession extends Entity<string> {
  public readonly startTime: Date;
  public readonly endTime: Date;
  public status: SessionStatus;
  public readonly createdAt: Date;
  public updatedAt: Date;

  public readonly learner: SessionParticipant;
  public readonly instructor: SessionParticipant;

  private constructor(payload: CreateUserSessionPayload) {
    super(payload.id);
    this.startTime = payload.startTime;
    this.endTime = payload.endTime;
    this.status = payload.status;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
    this.learner = payload.learner;
    this.instructor = payload.instructor;
  }

  updateStatus(status: SessionStatus): void {
    this.status = status;
  }

  static new(payload: CreateUserSessionPayload): UserSession {
    return new UserSession(payload);
  }
}
