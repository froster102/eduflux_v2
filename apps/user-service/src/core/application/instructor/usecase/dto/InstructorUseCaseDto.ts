import { Instructor } from '@domain/instructor/entity/Instructor';
import { User } from '@domain/user/entity/User';
import { UserUseCaseDto } from '@application/user/usecase/dto/UserUseCaseDto';
import type { UserDto } from '@application/user/usecase/dto/UserUseCaseDto';

export class InstructorUserCaseDto {
  public readonly id: string;
  public readonly profile: UserDto;
  public readonly sessionsConducted: number;
  public readonly totalCourses: number;
  public readonly totalLearners: number;

  private constructor(user: User, instructor: Instructor) {
    this.id = instructor.id;
    this.profile = UserUseCaseDto.fromEntity(user);
    this.sessionsConducted = instructor.getSessionsConducted();
    this.totalCourses = instructor.getTotalCourses();
    this.totalLearners = instructor.getTotalLearners();
  }

  public static fromUser(
    user: User,
    instructor: Instructor,
  ): InstructorUserCaseDto {
    return new InstructorUserCaseDto(user, instructor);
  }

  public static fromUsers(
    users: User[],
    instructors: Instructor[],
  ): InstructorUserCaseDto[] {
    const instructorMap = new Map<string, Instructor>();
    instructors.forEach((instructor) =>
      instructorMap.set(instructor.id, instructor),
    );

    return users
      .filter((user) => instructorMap.has(user.id))
      .map((user) => {
        const instructor = instructorMap.get(user.id) as Instructor;
        return this.fromUser(user, instructor);
      });
  }
}
