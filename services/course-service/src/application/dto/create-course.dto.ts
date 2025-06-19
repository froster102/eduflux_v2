export interface CreateCourseDto {
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}
