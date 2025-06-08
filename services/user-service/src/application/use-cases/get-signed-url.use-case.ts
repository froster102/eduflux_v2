import type {
  IFileStorageService,
  ISignedUploadUrlResponse,
} from '@/domain/services/file-storage.service';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';

export class GetUploadUrlUseCase {
  constructor(
    @inject(TYPES.FileStorageService)
    private readonly fileStorageService: IFileStorageService,
  ) {}

  execute(userId: string): ISignedUploadUrlResponse {
    const publicId = `${userId}_profile_image`;
    const response = this.fileStorageService.createSignedUploadUrl({
      publicId,
    });
    return response;
  }
}
