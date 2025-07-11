export interface ICourseServiceGateway {
  getCourseDetails(courseId: string): Promise<Course>;
}
