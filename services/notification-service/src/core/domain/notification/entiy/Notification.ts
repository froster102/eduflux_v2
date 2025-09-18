import { Entity } from "@core/common/entity/Entity";
import type {
  CreateNotificationPayload,
  NewNotificationPayload,
} from "@core/domain/notification/entiy/type/CreateNotificationPayload";
import { NotificationStatus } from "@core/domain/notification/enum/NotificationStatus";

export class Notification extends Entity<string> {
  private readonly _userId: string;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _path: string;
  private _status: NotificationStatus;
  private _timestamp: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(payload: NewNotificationPayload) {
    super(payload.id);
    this._userId = payload.userId;
    this._title = payload.title;
    this._description = payload.description;
    this._path = payload.path;
    this._status = payload.status;
    this._timestamp = payload.timestamp;
    this._createdAt = payload.createdAt;
    this._updatedAt = payload.updatedAt;
  }

  get userId(): string {
    return this._userId;
  }
  get title(): string {
    return this._title;
  }
  get description(): string {
    return this._description;
  }
  get path(): string {
    return this._path;
  }
  get status(): NotificationStatus {
    return this._status;
  }
  get timestamp(): string {
    return this._timestamp;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  markAsSeen() {
    this._status = NotificationStatus.SEEN;
  }

  static create(payload: CreateNotificationPayload): Notification {
    return new Notification({
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static new(payload: NewNotificationPayload): Notification {
    return new Notification(payload);
  }
}
