export interface CreateApplicationStatsPayload {
  id: string;
  totalLearners: number;
  totalInstructors: number;
  totalCourses: number;
  platformEarnings: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ApplicationStats {
  id: string;
  totalLearners: number;
  totalInstructors: number;
  totalCourses: number;
  platformEarnings: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(payload: CreateApplicationStatsPayload) {
    this.id = payload.id;
    this.totalLearners = payload.totalLearners;
    this.totalInstructors = payload.totalInstructors;
    this.totalCourses = payload.totalCourses;
    this.platformEarnings = payload.platformEarnings;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
  }

  incrementLearners(): void {
    this.totalLearners += 1;
    this.updatedAt = new Date();
  }

  incrementInstructors(): void {
    this.totalInstructors += 1;
    this.updatedAt = new Date();
  }

  incrementCourses(): void {
    this.totalCourses += 1;
    this.updatedAt = new Date();
  }

  addPlatformEarnings(amount: number): void {
    this.platformEarnings += amount;
    this.updatedAt = new Date();
  }

  static new(
    payload: Omit<CreateApplicationStatsPayload, 'createdAt' | 'updatedAt'>,
  ): ApplicationStats {
    const now = new Date();
    return new ApplicationStats({
      ...payload,
      platformEarnings: payload.platformEarnings ?? 0,
      createdAt: now,
      updatedAt: now,
    });
  }
}
