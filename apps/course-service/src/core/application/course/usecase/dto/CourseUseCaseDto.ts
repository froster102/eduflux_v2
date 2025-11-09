import { Course } from '@core/domain/course/entity/Course';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import { CourseLevel } from '@core/domain/course/enum/CourseLevel';

export class CourseUseCaseDto {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly thumbnail: string | null;
  readonly level: CourseLevel | null;
  readonly categoryId: string;
  readonly slug: string;
  readonly price: number | null;
  readonly isFree: boolean;
  readonly status: CourseStatus;
  readonly feedback: string | null;
  readonly instructor: {
    id: string;
    name: string;
  };
  readonly averageRating: number;
  readonly ratingCount: number;
  readonly enrollmentCount: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly publishedAt: Date | null;

  private constructor(course: Course) {
    this.id = course.id;
    this.title = course.title;
    this.description = course.description;
    this.thumbnail = course.thumbnail;
    this.level = course.level;
    this.categoryId = course.categoryId;
    this.slug = course.slug;
    this.price = course.price;
    this.isFree = course.isFree;
    this.status = course.status;
    this.feedback = course.feedback;
    this.instructor = course.instructor;
    this.averageRating = course.averageRating;
    this.ratingCount = course.ratingCount;
    this.enrollmentCount = course.enrollmentCount;
    this.createdAt = course.createdAt;
    this.updatedAt = course.updatedAt;
    this.publishedAt = course.publishedAt;
  }

  static fromEntity(course: Course): CourseUseCaseDto {
    return new CourseUseCaseDto(course);
  }

  static fromEntities(courses: Course[]): CourseUseCaseDto[] {
    return courses.map((course) => this.fromEntity(course));
  }
}
