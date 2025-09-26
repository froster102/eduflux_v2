import { Instructor } from '@core/domain/instructor/entity/Instructor';
import { User } from '@core/domain/user/entity/User';
import { UserDto } from '@core/domain/user/usecase/dto/UserDto';

export class InstructorDto {
  public readonly id: string;
  public readonly user: UserDto;
  public readonly sessionsConducted: number;
  public readonly totalCourses: number;
  public readonly totalLearners: number;

  private constructor(user: User, instructor: Instructor) {
    this.id = instructor.getId();
    this.user = UserDto.fromEntity(user);
    this.sessionsConducted = instructor.getSessionsConducted();
    this.totalCourses = instructor.getTotalCourses();
    this.totalLearners = instructor.getTotalLearners();
  }

  public static fromUser(user: User, instructor: Instructor): InstructorDto {
    return new InstructorDto(user, instructor);
  }

  public static fromUsers(
    users: User[],
    instructors: Instructor[],
  ): InstructorDto[] {
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
