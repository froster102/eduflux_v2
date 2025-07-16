import { AssetDto } from '../use-cases/asset.dto';

export interface LectureDto {
  _class: ClassType;
  id: string;
  courseId: string;
  title: string;
  description: string;
  assetId: string | null;
  preview: boolean;
  sortOrder: number;
  objectIndex: number;
  asset?: AssetDto;
}
