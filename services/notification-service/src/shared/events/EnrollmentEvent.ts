export type EnrollmentEvent = {
  type: "enrollment.success";
  correlationId: string;
  data: {
    enrollmentId: string;
    userId: string;
    courseId: string;
    occuredAt: string;
    path: string;
  };
};
