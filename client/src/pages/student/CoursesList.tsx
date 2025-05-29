import { Divider } from "@heroui/divider";
import React from "react";

import { useGetAllAvailableCoursesQuery } from "@/features/student/courses/hooks/queries";
import CourseCard from "@/components/CourseCard";
import { useAuthStore } from "@/store/auth-store";
import { useGetStudentQuery } from "@/features/student/hooks/queries";

export default function CoursesListPage() {
  const {
    user: { userId, role },
  } = useAuthStore();
  const { data: coursesData, isLoading } = useGetAllAvailableCoursesQuery();
  const { data: student, isLoading: isStudentLoading } =
    useGetStudentQuery(userId);

  const studentEnrollmentMap = React.useMemo(() => {
    if (
      !isStudentLoading &&
      student?.student?.enrollments &&
      student.student.enrollments.length > 0
    ) {
      const map = new Map<string, Enrollment>();

      student.student.enrollments.forEach((enrollment) => {
        map.set(enrollment.courseId, enrollment);
      });

      return map;
    }
  }, [student]);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-3xl font-bold">Courses</p>
          <small className="text-sm text-default-500">
            Below are the list of available courses
          </small>
        </div>
      </div>
      <Divider className="mt-4" orientation="horizontal" />
      <div className="gap-4 flex flex-col  sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 pt-8">
        {isLoading ? (
          <p>Loading course list</p>
        ) : (
          (coursesData?.courses || []).map((course, i) => (
            <CourseCard
              key={i}
              course={course}
              enrollment={
                role === "STUDENT" && studentEnrollmentMap?.has(course.id)
                  ? studentEnrollmentMap.get(course.id)
                  : undefined
              }
            />
          ))
        )}
      </div>
    </>
  );
}
