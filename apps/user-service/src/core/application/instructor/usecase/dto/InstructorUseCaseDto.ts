import { Instructor } from '@core/domain/instructor/entity/Instructor';
import { User } from '@core/domain/user/entity/User';
import { UserDto } from '@core/domain/user/usecase/dto/UserDto';

export class InstructorUserCaseDto {
  public readonly id: string;
  public readonly profile: UserDto;
  public readonly sessionsConducted: number;
  public readonly totalCourses: number;
  public readonly totalLearners: number;

  private constructor(user: User, instructor: Instructor) {
    this.id = instructor.getId();
    this.profile = UserDto.fromEntity(user);
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
      instructorMap.set(instructor.getId(), instructor),
    );

    return users
      .filter((user) => instructorMap.has(user.getId()))
      .map((user) => {
        const instructor = instructorMap.get(user.getId()) as Instructor;
        return this.fromUser(user, instructor);
      });
  }
}
