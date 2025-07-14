import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import Dompurify from "dompurify";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import React from "react";
import { Avatar } from "@heroui/avatar";
import { addToast } from "@heroui/toast";
import { Divider } from "@heroui/divider";
import { VideoIcon } from "lucide-react";

import CourseIcon from "@/assets/icons/CourseIcon";
import { IMAGE_BASE_URL } from "@/config/image";
import PlayIcon from "@/assets/icons/PlayIcon";
import PreviewLectureModal from "@/features/learner/courses/components/PreviewLectureModal";
import { useGetInstructorProfile } from "@/features/learner/hooks/queries";
import { useEnrollForCourse } from "@/features/learner/courses/hooks/mutations";
import { tryCatch } from "@/utils/try-catch";
import {
  useGetCourseInfo,
  useGetPublishedCourseCurriculum,
} from "@/features/learner/courses/hooks/queries";
import MessageIcon from "@/assets/icons/MessageIcon";
import NoteIcon from "@/assets/icons/NoteIcon";

export const Route = createFileRoute("/learner/_layout/courses/$courseId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseId } = Route.useParams();
  const { data: courseInfo, isLoading: isCourseInfoLoading } =
    useGetCourseInfo(courseId);
  let { data: courseCurriculum, isLoading: isCourseCurriculumLoading } =
    useGetPublishedCourseCurriculum(courseId);
  let { data: instructorProfile, isLoading: isInstructorProfileLoading } =
    useGetInstructorProfile(courseInfo?.instructor.id!);
  let [openPreviewModal, setOpenPreviewModal] = React.useState(false);
  const [selectedPreviewLecture, setSelectedPreviewLecture] =
    React.useState<Lecture | null>(null);
  const enrollForCourse = useEnrollForCourse();

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
      <div className="flex flex-col lg:flex-row gap-4 w-full pt-4">
        <Card className="bg-transparent flex flex-col gap-4" shadow="none">
          {isCourseInfoLoading ? (
            <Skeleton className="h-[40vh] rounded-lg">course info</Skeleton>
          ) : (
            <div className="py-4">
              <p className="text-2xl font-semibold">{courseInfo?.title}</p>
              <div dangerouslySetInnerHTML={descriptionHtml} className="pt-2" />
            </div>
          )}
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
                      src={instructorProfile?.imageUrl}
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
              </CardFooter>
            </Card>
          )}
        </Card>
        <Card className="max-w-sm w-full h-fit bg-background border border-default-200">
          <CardBody className="flex flex-col w-full gap-4">
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
            <p className="text-4xl font-semibold">${courseInfo?.price}</p>
            <Button color="primary" onPress={handleEnrollForCourse}>
              Buy course now
            </Button>
            <Button startContent={<MessageIcon />} variant="bordered">
              Send a message to instructor
            </Button>
            <Divider />
            <div>
              <p className="font-semibold">This course includes:</p>
              <ul className="text-default-600">
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
          </CardBody>
        </Card>
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
