import type { IUseCase } from './interface/use-case.interface';

export interface BookSessionInput {
  instructorId: string;
  availabilitySlotId: string;
  learnerId: string;
  currency: string;
}

export interface BookSessionOutput {
  id: string;
  instructorId: string;
  studentId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  price: number;
  currency: string;
}

export class BookSessionUseCase
  implements IUseCase<BookSessionInput, BookSessionOutput>
{
  execute(bookSessionInput: BookSessionInput): Promise<BookSessionOutput> {}
}
