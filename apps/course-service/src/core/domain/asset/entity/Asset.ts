import { Entity } from '@eduflux-v2/shared/entities/Entity';
import { StorageProvider } from '@core/domain/asset/enum/StorageProvider';
import { AccessType } from '@core/domain/asset/enum/AccessType';
import { ResourceType } from '@core/domain/asset/enum/ResourceType';
import { MediaStatus } from '@core/domain/asset/enum/MediaStatus';
import type { CreateAssetPayload } from './types/CreateAssetPayload';
import type { NewAssetPayload } from './types/NewAssetPayload';
import type { MediaSource } from './types/CreateAssetPayload';

export class Asset extends Entity<string> {
  private readonly _provider: StorageProvider;
  private _providerSpecificId: string | null;
  private _resourceType: ResourceType | null;
  private readonly _accessType: AccessType;
  private _originalFileName: string | null;
  private _duration: number | null;
  private _status: MediaStatus;
  private _mediaSources: MediaSource[];
  private _additionalMetadata: Record<string, any> | null;

  private constructor(payload: NewAssetPayload) {
    super(payload.id);
    this._provider = payload.provider;
    this._providerSpecificId = payload.providerSpecificId;
    this._resourceType = payload.resourceType;
    this._accessType = payload.accessType;
    this._originalFileName = payload.originalFileName;
    this._duration = payload.duration;
    this._status = payload.status;
    this._mediaSources = payload.mediaSources;
    this._additionalMetadata = payload.additionalMetadata;
  }

  get provider(): StorageProvider {
    return this._provider;
  }

  get providerSpecificId(): string | null {
    return this._providerSpecificId;
  }

  get resourceType(): ResourceType | null {
    return this._resourceType;
  }

  get accessType(): AccessType {
    return this._accessType;
  }

  get originalFileName(): string | null {
    return this._originalFileName;
  }

  get duration(): number | null {
    return this._duration;
  }

  get status(): MediaStatus {
    return this._status;
  }

  get mediaSources(): MediaSource[] {
    return [...this._mediaSources];
  }

  get additionalMetadata(): Record<string, any> | null {
    return this._additionalMetadata;
  }

  confirmUpload(
    providerSpecificId: string,
    duration: number | null,
    additionalMetadata: Record<string, any> | null = null,
  ): void {
    this._providerSpecificId = providerSpecificId;
    this._duration = duration;
    this._additionalMetadata = additionalMetadata;
    this._status = MediaStatus.UPLOADED;
  }

  markAsFailed(): void {
    this._status = MediaStatus.FAILED;
  }

  markAsDeleted(): void {
    this._status = MediaStatus.DELETED;
  }

  markAsAssigned(): void {
    this._status = MediaStatus.ASSIGNED;
  }

  markAsProcessing(): void {
    this._status = MediaStatus.PROCESSING;
  }

  addMediaSource(mediaSource: MediaSource): void {
    this._mediaSources.push(mediaSource);
  }

  isConfirmed(): boolean {
    return (
      this._status === MediaStatus.UPLOADED && this._providerSpecificId !== null
    );
  }

  static create(payload: CreateAssetPayload): Asset {
    return new Asset({
      id: crypto.randomUUID(),
      provider: payload.provider,
      providerSpecificId: payload.providerSpecificId,
      resourceType: payload.resourceType || null,
      accessType: payload.accessType,
      originalFileName: payload.originalFileName || null,
      duration: null,
      status: MediaStatus.PENDING,
      mediaSources: payload.mediaSources || [],
      additionalMetadata: null,
    });
  }

  static new(payload: NewAssetPayload): Asset {
    return new Asset(payload);
  }
}
