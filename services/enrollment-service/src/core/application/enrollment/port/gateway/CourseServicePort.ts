export interface CourseServicePort {
  getCourse(courseId: string): Promise<Course>;
}
