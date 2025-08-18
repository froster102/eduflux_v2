import type { AddSectionDto } from './add-section.dto';

export type UpdateSectionDto = Partial<AddSectionDto> & {
  courseId: string;
  sectionId: string;
};
