import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { IUseCase } from './use-case.interface';
import { CreateLectureInput } from './create-lecture.interface';
import { Lecture } from '@/domain/entity/lecture.entity';

export interface UpdateLectureDto extends Partial<CreateLectureInput> {
  courseId: string;
  lectureId: string;
}

export interface UpdateLectureInput {
  updateLectureDto: UpdateLectureDto;
  actor: AuthenticatedUserDto;
}

export interface IUpdateLectureUseCase
  extends IUseCase<UpdateLectureInput, Lecture> {}
