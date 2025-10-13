export interface Instructor {
  readonly id: string;
  readonly name: string;
}

export interface CreateCoursePayload {
  title: string;
  categoryId: string;
  instructor: Instructor;
}
