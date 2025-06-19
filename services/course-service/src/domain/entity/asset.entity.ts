export type StorageProvider = 'cloudinary' | 's3' | 'gcs';
export type ResourceType = 'image' | 'video' | 'raw';
export type AccessType = 'public' | 'private';
export type MediaStatus =
  | 'pending'
  | 'uploaded'
  | 'failed'
  | 'deleted'
  | 'assigned';
export type MediaSource = { type: string; src: string };

export class Asset {
  private _class: ClassType = 'asset';
  private _id: string;
  private _provider: StorageProvider;
  private _providerSpecificId: string | null;
  private _resourceType: ResourceType | null;
  private _accessType: AccessType;
  private _originalFileName: string | null;
  private _duration: number | null;
  private _status: MediaStatus;
  private _mediaSources: MediaSource[];
  private _additionalMetadata: Record<string, any> | null;

  private constructor(
    id: string,
    provider: StorageProvider,
    providerSpecificId: string | null,
    resourceType: ResourceType | null,
    accessType: AccessType,
    originalFileName: string | null,
    duration: number | null,
    status: MediaStatus,
    mediaSources: MediaSource[],
    additionalMetadata: Record<string, any> | null,
  ) {
    this._id = id;
    this._provider = provider;
    this._providerSpecificId = providerSpecificId;
    this._resourceType = resourceType;
    this._accessType = accessType;
    this._originalFileName = originalFileName;
    this._mediaSources = mediaSources;
    this._duration = duration;
    this._status = status;
    this._additionalMetadata = additionalMetadata;
  }

  static create(
    id: string,
    provider: StorageProvider = 'cloudinary',
    providerSpecificAssetId: string,
    accessType: AccessType,
  ): Asset {
    return new Asset(
      id,
      provider,
      providerSpecificAssetId,
      null,
      accessType,
      null,
      null,
      'pending',
      [],
      null,
    );
  }

  static fromPersistence(
    id: string,
    provider: StorageProvider,
    providerSpecificId: string | null,
    resourceType: ResourceType | null,
    accessType: AccessType,
    originalFileName: string | null,
    duration: number | null,
    status: MediaStatus,
    mediaSources: MediaSource[],
    additionalMetadata: Record<string, any> | null,
  ): Asset {
    return new Asset(
      id,
      provider,
      providerSpecificId,
      resourceType,
      accessType,
      originalFileName,
      duration,
      status,
      mediaSources,
      additionalMetadata,
    );
  }

  get class(): ClassType {
    return this._class;
  }

  get id(): string {
    return this._id;
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
    return this._mediaSources;
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
    this._status = 'uploaded';
  }

  markAsFailed(): void {
    this._status = 'failed';
  }

  markAsDeleted(): void {
    this._status = 'deleted';
  }

  markAsAssigned(): void {
    this._status = 'assigned';
  }

  addMediaSource(mediaSource: MediaSource): void {
    this._mediaSources.push(mediaSource);
  }

  isConfirmed(): boolean {
    return this._status === 'uploaded' && this._providerSpecificId !== null;
  }

  toJSON(): object {
    return {
      _class: this._class,
      id: this._id,
      provider: this._provider,
      providerSpecificId: this._providerSpecificId,
      resourceType: this._resourceType,
      accessType: this._accessType,
      originalFileName: this._originalFileName,
      duration: this._duration,
      status: this._status,
      mediaSources: this._mediaSources,
      additionalMetadata: this._additionalMetadata,
    };
  }
}
