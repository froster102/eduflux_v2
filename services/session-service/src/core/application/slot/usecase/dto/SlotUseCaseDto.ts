import type { Slot } from '@core/domain/slot/entity/Slot';
import type { SlotStatus } from '@core/domain/slot/enum/SlotStatus';

export class SlotUseCaseDto {
  readonly id: string;
  readonly instructorId: string;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly status: SlotStatus;

  private constructor(slot: Slot) {
    this.id = slot.id;
    this.instructorId = slot.instructorId;
    this.startTime = slot.startTime;
    this.status = slot.status;
    this.endTime = slot.endTime;
  }

  static fromEntity(slot: Slot): SlotUseCaseDto {
    return new SlotUseCaseDto(slot);
  }

  static fromEntities(slots: Slot[]): SlotUseCaseDto[] {
    return slots.map((slot) => this.fromEntity(slot));
  }
}
