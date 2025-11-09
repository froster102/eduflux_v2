export interface CreateUserGrowthSnapshotPayload {
  date: Date;
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UserGrowthSnapshot {
  date: Date;
  userCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(payload: CreateUserGrowthSnapshotPayload) {
    this.date = payload.date;
    this.userCount = payload.userCount;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
  }

  incrementCount(): void {
    this.userCount += 1;
    this.updatedAt = new Date();
  }

  static new(
    payload: Omit<CreateUserGrowthSnapshotPayload, 'createdAt' | 'updatedAt'>,
  ): UserGrowthSnapshot {
    const now = new Date();
    return new UserGrowthSnapshot({
      ...payload,
      createdAt: now,
      updatedAt: now,
    });
  }
}
