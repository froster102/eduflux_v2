import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import { Button } from "@heroui/button";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Tooltip } from "@heroui/tooltip";

import { useGetCoursesByIds } from "../../courses/hooks/queries";
import { useUnEnrollCourseMutation } from "../hooks/mutations";

interface StudentCoursesProps {
  user: User;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

export default function StudentCourses({
  user,
  page,
  pageSize,
  setPage,
  setPageSize,
}: StudentCoursesProps) {
  const enableGetCoursesQuery =
    (user.student?.enrolledCourses || []).length > 0 || false;
  const {
    data: enrolledCourses,
    isLoading: isEnrolledCoursesLoading,
    isFetching: isEnrolledCoursesFetching,
  } = useGetCoursesByIds(
    user.student?.enrolledCourses || [],
    { page, pageSize },
    enableGetCoursesQuery,
  );
  const unEnrollCourseMutation = useUnEnrollCourseMutation({ page, pageSize });

  const totalEnrolledCourse = React.useMemo(() => {
    if (enrolledCourses?.total) {
      return enrolledCourses.total;
    }

    return 0;
  }, [enrolledCourses]);

  return (
    <Card className="bg-background">
      <CardHeader className="font-semibold text-base">
        Enrolled Courses
      </CardHeader>
      <Divider />
      <CardBody className="p-2 max-h-60 overflow-y-auto">
        {isEnrolledCoursesLoading || isEnrolledCoursesFetching ? (
          <Spinner className="p-4" variant="simple" />
        ) : enrolledCourses?.courses?.length ? (
          enrolledCourses.courses.map((course) => (
            <Card key={course.id} className="p-2 mb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">{course.title}</span>
                <Tooltip closeDelay={50} content="Unenroll">
                  <Button
                    isIconOnly
                    className="bg-transparent"
                    radius="full"
                    size="sm"
                    startContent={
                      <Icon
                        icon="solar:user-cross-rounded-line-duotone"
                        width={24}
                      />
                    }
                    onPress={() => {
                      unEnrollCourseMutation.mutate({
                        courseId: course.id,
                        userId: user.id,
                      });
                      setPage(1);
                    }}
                  />
                </Tooltip>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-sm text-gray-500">No enrolled courses found.</p>
        )}
        {totalEnrolledCourse > 0 && (
          <label className="text-default-400 text-small text-right">
            Page size:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="10">10</option>
            </select>
          </label>
        )}
      </CardBody>
      {totalEnrolledCourse && totalEnrolledCourse > pageSize ? (
        <CardFooter className="flex justify-center">
          <Pagination
            page={page}
            total={Math.ceil(totalEnrolledCourse / pageSize)}
            onChange={setPage}
          />
        </CardFooter>
      ) : null}
    </Card>
  );
}
