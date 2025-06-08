export interface ISignedUploadUrlResponse {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  publicId: string;
  uploadUrl: string;
}

export interface IFileStorageService {
  createSignedUploadUrl(options?: {
    folder?: string;
    publicId?: string;
  }): ISignedUploadUrlResponse;
}
