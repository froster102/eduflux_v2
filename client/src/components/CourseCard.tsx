import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { useNavigate } from "react-router";
import React from "react";

import CoursePreviewModal from "./CoursePreviewModal";

import { useEnrollForCourseMutaion } from "@/features/student/courses/hooks/mutations";

interface CourseCardProps {
  course: Course;
  enrollment?: Enrollment;
  showEnrollButton?: boolean;
}

export default function CourseCard({
  course,
  enrollment,
  showEnrollButton = true,
}: CourseCardProps) {
  const navigate = useNavigate();
  const enrollmentForCourseMutation = useEnrollForCourseMutaion();
  const [openPreviewModal, setOpenPreviewModal] = React.useState(false);

  function handleCourseEnrollment(courseId: string) {
    enrollmentForCourseMutation.mutate(courseId);
  }

  return (
    <>
      <Card
        isPressable
        className="h-full bg-background"
        shadow="sm"
        onPress={() => {
          setOpenPreviewModal(true);
        }}
      >
        <CardBody className="p-0 grid grid-cols-2 sm:flex overflow-hidden">
          <Image
            alt="Card background"
            className="object-cover aspect-[16/9] h-full w-full  rounded-lg"
            fallbackSrc="https://via.placeholder.com/300x200"
            loading="lazy"
            src={typeof course.thumbnail === "string" ? course.thumbnail : ""}
            width="100%"
          />
          <div className="flex flex-col p-4 gap-2 w-full">
            <h4 className="font-bold text-sm md:text-large truncate w-full max-w-full overflow-hidden">
              {course.title}
            </h4>
            <small className="text-default-500 w-full max-h-[40px] overflow-hidden text-ellipsis">
              {course.description}
            </small>
            {/* <small className="text-default-500 text-sm">
              {course.totalEnrollments} Students enrolled
            </small> */}
            {enrollment?.status === "approved" ? (
              <Button
                className="ml-auto bg-zinc-900 text-zinc-100"
                size="sm"
                type="button"
                onPress={() => navigate(`/courses/${course.id}`)}
              >
                Go to course
              </Button>
            ) : (
              showEnrollButton && (
                <Button
                  className="ml-auto bg-zinc-900 text-zinc-100"
                  isDisabled={enrollment?.status === "pending"}
                  isLoading={enrollmentForCourseMutation.isPending}
                  size="sm"
                  onPress={() => {
                    handleCourseEnrollment(course.id);
                  }}
                >
                  {enrollment?.status === "pending" ? "Requested" : "Enroll"}
                </Button>
              )
            )}
          </div>
        </CardBody>
      </Card>
      <CoursePreviewModal
        key={course.id}
        course={course}
        isOpen={openPreviewModal}
        onClose={() => {
          setOpenPreviewModal(false);
        }}
      />
    </>
  );
}
