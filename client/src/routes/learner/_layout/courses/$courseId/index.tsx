import { Divider } from "@heroui/divider";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody, CardHeader } from "@heroui/card";
import Dompurify from "dompurify";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";

import {
  useGetPublishedCourseCurriculum,
  useGetPublishedCourseInfo,
} from "@/features/learner/courses/hooks/queries";
import CourseIcon from "@/assets/icons/CourseIcon";
import { IMAGE_BASE_URL } from "@/config/image";
import PlayIcon from "@/assets/icons/PlayIcon";

export const Route = createFileRoute("/learner/_layout/courses/$courseId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseId } = Route.useParams();
  const { data: courseInfo, isLoading: isCourseInfoLoading } =
    useGetPublishedCourseInfo(courseId);
  const { data: courseCurriculum, isLoading: isCourseCurriculumLoading } =
    useGetPublishedCourseCurriculum(courseId);

  const descriptionHtml = {
    __html: Dompurify.sanitize(
      (courseInfo && courseInfo.description) as string,
    ),
  };

  return (
    <>
      <div>
        <p className="text-3xl font-bold">Courses</p>
        <small className="text-sm text-default-500">
          Below is the information about the course
        </small>
      </div>
      <div className="py-4">
        <Divider />
      </div>
      <div className="flex gap-4">
        <div>
          <div className="relative h-[60vh] w-full">
            <Image
              className="w-full h-full object-cover"
              height={500}
              isLoading={isCourseInfoLoading}
              src={
                !isCourseInfoLoading
                  ? `${IMAGE_BASE_URL}${courseInfo?.thumbnail}`
                  : ""
              }
              width="100%"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-black/70 z-10" />
            <div className="absolute inset-0 container mx-auto px-4 flex flex-col py-2 justify-end pb-12 z-20">
              <Card className="max-w-xs h-fit ml-auto bg-secondary-600">
                <CardHeader className="text-lg font-semibold pb-0">
                  Enroll for this course now
                </CardHeader>
                <CardBody className="py-2 pt-0">
                  <p className="text-xl font-semibold">$ {courseInfo?.price}</p>
                  <Button color="primary">Enroll</Button>
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="py-4">
            <p className="text-xl font-semibold">What is this course about </p>
            <div dangerouslySetInnerHTML={descriptionHtml} className="pt-2" />
          </div>
          <div>
            <p className="text-xl font-semibold">Course Curriculum</p>
            <Skeleton isLoaded={!isCourseCurriculumLoading}>
              <div className="pt-2">
                <Card className=" bg-secondary-600" shadow="sm">
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
                              <div className="flex items-center justify-center bg-secondary-500 h-6 w-6 text-sm rounded-full flex-shrink-0">
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
        </div>
        <Card className="max-w-lg w-full h-fit">
          <CardHeader className="text-xl font-semibold">Instructor</CardHeader>
          <CardBody>Instructor description</CardBody>
        </Card>
      </div>
    </>
  );
}
