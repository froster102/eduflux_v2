import { ResourceType } from '@core/domain/asset/enum/ResourceType';
import z from 'zod/v4';

export const addAssetToLectureSchema = z.object({
  key: z.string(),
  fileName: z.string(),
  resourceType: z.enum(Object.values(ResourceType)),
  uuid: z.uuidv4(),
});
