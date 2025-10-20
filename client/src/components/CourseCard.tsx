import { Card, CardBody, CardFooter } from "@heroui/card";
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
    <Card
      isPressable
      className="bg-background w-full border border-default-300 hover:shadow-md transition-shadow"
      shadow="none"
      onPress={() => {
        if (onPress) {
          onPress(course);
        }
      }}
    >
      <Image
        alt={course.title}
        className="object-cover w-full aspect-[16/9] rounded-t-lg"
        loading="lazy"
        src={
          course.thumbnail
            ? `${IMAGE_BASE_URL}${course.thumbnail}`
            : "/placeholder.png"
        }
      />

      <CardBody className="p-4 space-y-1">
        <div className="flex items-center justify-between">
          <Chip
            className="capitalize text-xs"
            color={courseLevelMap[course.level] || "default"}
            size="sm"
            variant="flat"
          >
            {course.level}
          </Chip>
        </div>

        <h3 className="font-semibold text-base line-clamp-2 leading-tight">
          {course.title}
        </h3>

        {!isInstructorCourse && (
          <p className="text-sm text-default-500">
            by {course.instructor.name}
          </p>
        )}

        <div className="flex items-center gap-1 text-sm text-default-500">
          <UsersIcon width={14} />
          <span>{course.enrollmentCount ?? 0} students enrolled</span>
        </div>
      </CardBody>

      <CardFooter className="pt-0 border-t border-default-200">
        <div className="flex items-center justify-between w-full">
          {isSubscribed ? (
            <Button
              className="flex-1"
              color="primary"
              size="sm"
              variant="solid"
              onPress={() => {
                if (onPress) {
                  onPress(course);
                }
              }}
            >
              Go to course
            </Button>
          ) : course.isFree ? (
            <span className="text-sm text-success-500 font-medium">Free</span>
          ) : (
            <span className="text-lg font-bold text-foreground">
              ${course.price}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
