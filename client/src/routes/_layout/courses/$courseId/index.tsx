import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import Dompurify from "dompurify";
import { Button } from "@heroui/button";
import React from "react";
import { Avatar } from "@heroui/avatar";
import { addToast } from "@heroui/toast";
import { Image } from "@heroui/image";
import { VideoIcon } from "lucide-react";

import CourseIcon from "@/components/icons/CourseIcon";
import PlayIcon from "@/components/icons/PlayIcon";
import PreviewLectureModal from "@/features/course/components/PreviewLectureModal";
import { tryCatch } from "@/utils/try-catch";
import { IMAGE_BASE_URL } from "@/config/image";
import NoteIcon from "@/components/icons/NoteIcon";
import MessageIcon from "@/components/icons/MessageIcon";
import { useGetCourseInfo } from "@/features/course/hooks/useGetCourseInfo";
import { useGetPublishedCourseCurriculum } from "@/features/course/hooks/useGetPublishedCourseCurriculum";
import { useEnrollForCourse } from "@/features/enrollment/hooks/useEnrollForCourse";
import { useCheckUserEnrollment } from "@/features/enrollment/hooks/useCheckUserEnrollment";
import { useGetInstructorProfile } from "@/features/instructor/hooks/useGetInstructorProfile";

export const Route = createFileRoute("/_layout/courses/$courseId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();
  const { data: courseInfo, isLoading: isCourseInfoLoading } =
    useGetCourseInfo(courseId);
  const { data: courseCurriculum, isLoading: isCourseCurriculumLoading } =
    useGetPublishedCourseCurriculum(courseId);
  const { data: instructorProfile, isLoading: isInstructorProfileLoading } =
    useGetInstructorProfile(courseInfo?.instructor.id!);
  const [openPreviewModal, setOpenPreviewModal] = React.useState(false);
  const [selectedPreviewLecture, setSelectedPreviewLecture] =
    React.useState<Lecture | null>(null);
  const enrollForCourse = useEnrollForCourse();
  const {
    data: userEnrollmentStatus,
    isLoading: isUserEnrollmentStatusLoading,
  } = useCheckUserEnrollment(courseId);

  const descriptionHtml = {
    __html: Dompurify.sanitize(
      (courseInfo && courseInfo.description) as string,
    ),
  };

  const curriculumItemsLength: {
    totalChapters: number;
    totalLectures: number;
  } = React.useMemo(() => {
    if (isCourseCurriculumLoading || !courseCurriculum) {
      return { totalChapters: 0, totalLectures: 0 };
    }

    return courseCurriculum.reduce(
      (acc, el) => {
        if (el._class === "chapter") {
          acc.totalChapters++;
        } else if (el._class === "lecture") {
          acc.totalLectures++;
        }

        return acc;
      },
      { totalChapters: 0, totalLectures: 0 },
    );
  }, [isCourseCurriculumLoading, courseCurriculum]);

  const previewLectures: Lecture[] = React.useMemo(() => {
    if (isCourseCurriculumLoading || !courseCurriculum) {
      return [];
    }

    return courseCurriculum.filter(
      (curriculum): curriculum is Lecture =>
        curriculum._class === "lecture" && !!curriculum.asset,
    );
  }, [isCourseCurriculumLoading, courseCurriculum]);

  function handleLecturePreview(lecture: Lecture) {
    setSelectedPreviewLecture(lecture);
    setOpenPreviewModal(true);
  }

  async function handleEnrollForCourse() {
    const { data, error } = await tryCatch(
      enrollForCourse.mutateAsync(courseId),
    );

    if (data) {
      window.location.assign(data.checkoutUrl);
    }

    if (error) {
      addToast({
        title: "Enrollment",
        description: "Failed to enroll for course.",
        color: "danger",
      });
    }
  }

  return (
    <>
      {isCourseInfoLoading ? (
        <Skeleton className="h-[5vh] rounded-lg w-full">course info</Skeleton>
      ) : (
        <p className="text-2xl font-semibold pt-4">{courseInfo?.title}</p>
      )}
      <div className="flex flex-col lg:flex-row gap-4 w-full pt-4">
        <div className="flex flex-col gap-2">
          <Card className="w-full h-fit bg-background border border-default-200">
            <CardBody className="flex lg:flex-row w-full gap-4">
              <div>
                {" "}
                <Image
                  className="w-full object-cover"
                  isLoading={isCourseInfoLoading}
                  src={
                    !isCourseInfoLoading
                      ? `${IMAGE_BASE_URL}${courseInfo?.thumbnail}`
                      : ""
                  }
                  width="100%"
                />
              </div>
              <div className="max-w-md w-full h-full flex flex-col justify-center">
                <div>
                  <p className="font-semibold pb-2">This course includes:</p>
                  <ul className="flex flex-col gap-2 text-default-600">
                    <li className="flex gap-2 items-center">
                      <NoteIcon width={18} />
                      {courseCurriculum?.length} Modules
                    </li>
                    <li className="flex gap-2 items-center">
                      <VideoIcon width={18} />
                      {curriculumItemsLength.totalLectures} Video lessons
                    </li>
                  </ul>
                </div>
                <div className="mt-auto w-fit">
                  {userEnrollmentStatus && !userEnrollmentStatus.isEnrolled ? (
                    <p className="text-2xl font-semibold py-4">
                      ${courseInfo?.price}
                    </p>
                  ) : null}
                  <Button
                    color="primary"
                    isLoading={
                      isUserEnrollmentStatusLoading || enrollForCourse.isPending
                    }
                    onPress={
                      userEnrollmentStatus && userEnrollmentStatus.isEnrolled
                        ? () =>
                            navigate({
                              to: `/courses/${courseId}/learn`,
                            })
                        : handleEnrollForCourse
                    }
                  >
                    {userEnrollmentStatus && userEnrollmentStatus.isEnrolled
                      ? "Got to course"
                      : "Buy course now"}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
          {isCourseInfoLoading ? (
            <Skeleton className="h-[30vh] rounded-lg w-full">
              course info
            </Skeleton>
          ) : (
            <div>
              <p className="font-semibold text-xl pt-4">
                What you&apos;ll learn in this course
              </p>
              <div dangerouslySetInnerHTML={descriptionHtml} className="pt-2" />
            </div>
          )}
          <Card
            className="bg-transparent flex flex-col gap-4 w-full"
            shadow="none"
          >
            {isInstructorProfileLoading ? (
              <Skeleton className="w-full h-[40vh] rounded-md">
                Instructor Profile
              </Skeleton>
            ) : (
              <Card className="w-full h-fit bg-background border border-default-200">
                <CardHeader className="text-lg font-medium flex pb-0">
                  <div>
                    <p>Instructor</p>
                    <div className="flex items-center gap-2 py-2">
                      <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src={`${IMAGE_BASE_URL}${instructorProfile?.image}`}
                      />
                      <p className="text-xl font-semibold">
                        {instructorProfile?.firstName}{" "}
                        {instructorProfile?.lastName}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <p className="text-sm">{instructorProfile?.bio}</p>
                </CardBody>
                <CardFooter className="pt-0">
                  <Button color="primary">Learn more..</Button>
                  <Button startContent={<MessageIcon />} variant="bordered">
                    Send a message to instructor
                  </Button>
                </CardFooter>
              </Card>
            )}
          </Card>
        </div>
        {isCourseCurriculumLoading ? (
          <Skeleton className="rounded-lg h-[50vh] w-full">
            Course curriculum
          </Skeleton>
        ) : (
          <div className="w-full">
            <p className="text-xl font-semibold">Course Curriculum</p>
            <Skeleton isLoaded={!isCourseCurriculumLoading}>
              <div className="pt-2">
                <Card
                  className="bg-transparent border border-default-200"
                  shadow="sm"
                >
                  <CardBody>
                    {courseCurriculum &&
                      courseCurriculum.map((curriculum, index) => (
                        <div
                          key={curriculum.id}
                          className={`capitalize py-2  ${curriculum._class === "lecture" ? "pl-8" : "pl-4"}  ${curriculum._class === "chapter" && index !== 0 ? "border-t border-secondary-100 pt-4 mt-4" : ""} `}
                        >
                          {curriculum._class === "chapter" ? (
                            <p className="font-bold text-lg">
                              {`${curriculum._class} ${curriculum.objectIndex}: ${curriculum.title}`}
                            </p>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center bg-primary text-black h-6 w-6 text-sm rounded-full flex-shrink-0">
                                {curriculum.objectIndex}
                              </div>
                              <CourseIcon
                                className="flex-shrink-0"
                                width={14}
                              />
                              <p className="flex-grow">{curriculum.title}</p>
                              {curriculum._class === "lecture" &&
                              curriculum.preview ? (
                                <Button
                                  className="bg-transparent flex text-xs items-center gap-2"
                                  size="sm"
                                  onPress={() =>
                                    handleLecturePreview(curriculum)
                                  }
                                >
                                  <span>
                                    <PlayIcon width={12} />
                                  </span>{" "}
                                  Preview{" "}
                                </Button>
                              ) : null}
                            </div>
                          )}
                        </div>
                      ))}
                  </CardBody>
                </Card>
              </div>
            </Skeleton>
          </div>
        )}
      </div>
      {!isCourseInfoLoading && (
        <PreviewLectureModal
          isOpen={openPreviewModal}
          lectures={previewLectures}
          selectedLecture={selectedPreviewLecture}
          onClose={() => {
            setOpenPreviewModal(false);
          }}
        />
      )}
    </>
  );
}
