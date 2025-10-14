import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";

import { IMAGE_BASE_URL } from "@/config/image";
import UsersIcon from "@/components/icons/UsersIcon";
import { courseLevelMap } from "@/config/course-level";

interface CourseCardProps {
  course: Course;
  isSubscribed?: boolean;
  isInstructorCourse?: boolean;
  onPress?: (course: Course) => void;
}

export default function CourseCard({
  course,
  isSubscribed,
  isInstructorCourse,
  onPress,
}: CourseCardProps) {
  return (
    <>
      <Card
        isPressable
        className="bg-background w-full border-1.5 border-default-200"
        shadow="none"
        onPress={() => {
          if (onPress) {
            onPress(course);
          }
        }}
      >
        <CardBody className="p-2 grid grid-cols-3 sm:flex sm:flex-col gap-2 overflow-hidden">
          <div className="rounded-md">
            <Image
              alt="Card background"
              className="object-cover aspect-[16/9] h-full w-full  rounded-lg"
              loading="lazy"
              src={
                course.thumbnail
                  ? `${IMAGE_BASE_URL}${course.thumbnail}`
                  : "/placeholder.png"
              }
            />
          </div>

          <div className="flex flex-col w-full">
            <div className="flex">
              <Chip
                className="capitalize text-xs"
                color={courseLevelMap[course.level]}
                size="sm"
                variant="flat"
              >
                {course.level}
              </Chip>
              <div className="flex gap-1 text-sm items-center ml-2 sm:ml-auto">
                <UsersIcon width={16} />
                <p className="text-xs sm:text-sm">
                  {course.enrollmentCount ?? 0}
                </p>
              </div>
            </div>
            <h4 className="font-medium text-sm md:text-large truncate w-full max-w-full overflow-hidden">
              {course.title}
            </h4>
            {!isInstructorCourse && (
              <small className="text-default-500">
                {course.instructor.name}
              </small>
            )}
            {/* <p>4.7</p> */}
            {isSubscribed ? (
              <div className="pt-2">
                <Button className="w-fit" color="primary" size="sm">
                  Go to course
                </Button>
              </div>
            ) : (
              <p className="text-sm sm:text-lg font-medium">
                {course.price ? `$ ${course.price}` : ""}
              </p>
            )}
          </div>
        </CardBody>
      </Card>
    </>
  );
}
