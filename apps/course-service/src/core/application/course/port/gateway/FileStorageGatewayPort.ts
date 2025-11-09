export interface FileUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType: string;
  originalFilename: string;
  additionalMetadata?: Record<string, any>;
}

export interface VerifyAssetResult {
  exists: boolean;
  originalFilename: string;
  resourceType: string;
  mediaSource?: {
    type: string;
    src: string;
  } | null;
}

export interface FileStorageGatewayPort {
  deleteFile(publicId: string, resourceType: string): Promise<void>;
  getAccessUrl(
    publicId: string,
    resourceType: string,
    accessType: 'public' | 'private',
    transformationOptions?: Record<string, any>,
    expiresInSeconds?: number,
  ): string;
  verifyAssetExists(
    key: string,
    resourceType: string,
  ): Promise<VerifyAssetResult>;
  verifyWebhookSignature(options: {
    signature: string;
    timestamp: string;
    payload: Record<string, any>;
  }): boolean;
}
