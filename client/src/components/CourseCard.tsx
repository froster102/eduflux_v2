import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { Chip } from "@heroui/chip";

import { IMAGE_BASE_URL } from "@/config/image";
import UsersIcon from "@/assets/icons/UsersIcon";

// import { useEnrollForCourseMutaion } from "@/features/learner/courses/hooks/mutations";

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

  return (
    <>
      <Card
        isPressable
        className="bg-background w-full border-1.5 border-default-200"
        shadow="sm"
        onPress={() => {
          navigate({ to: `/learner/courses/${course.id}` });
        }}
      >
        <CardBody className="p-2 grid grid-cols-3 sm:flex sm:flex-col gap-2 overflow-hidden">
          <div className="rounded-md">
            <Image
              alt="Card background"
              className="object-cover aspect-[16/9] h-full w-full  rounded-lg"
              loading="lazy"
              src={`${IMAGE_BASE_URL}${course.thumbnail}`}
            />
          </div>
          <div className="flex justify-between">
            <Chip className="capitalize text-xs">{course.level}</Chip>
            <div className="flex gap-1 text-sm items-center">
              <UsersIcon width={16} />
              <p>{course.enrollmentCount ?? 0}</p>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <h4 className="font-medium text-sm md:text-large truncate w-full max-w-full overflow-hidden">
              {course.title}
            </h4>
            <small className="text-default-500">{course.instructor.name}</small>
            {/* <p>4.7</p> */}
            <p className="text-lg font-medium">${course.price}</p>
            {/* <small className="text-default-500 text-sm">
              {course.totalEnrollments} Students enrolled
            </small> */}
            {/* {enrollment?.status === "approved" ? (
              <Button
                className="ml-auto bg-zinc-900 text-zinc-100"
                size="sm"
                type="button"
                // onPress={() => navigate(`/courses/${course.id}`)}
              >
                Go to course
              </Button>
            ) : (
              showEnrollButton && (
                <Button
                  className="ml-auto bg-zinc-900 text-zinc-100"
                  isDisabled={enrollment?.status === "pending"}
                  // isLoading={enrollmentForCourseMutation.isPending}
                  size="sm"
                  onPress={() => {
                    handleCourseEnrollment(course.id);
                  }}
                >
                  {enrollment?.status === "pending" ? "Requested" : "Enroll"}
                </Button>
              )
            )} */}
          </div>
        </CardBody>
      </Card>
      {/* <CoursePreviewModal
        key={course.id}
        course={course}
        isOpen={openPreviewModal}
        onClose={() => {
          setOpenPreviewModal(false);
        }}
      /> */}
    </>
  );
}
