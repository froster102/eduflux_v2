import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { useNavigate } from "@tanstack/react-router";
import { Divider } from "@heroui/divider";
import { User } from "@heroui/user";

import { IMAGE_BASE_URL } from "@/config/image";
import UsersIcon from "@/components/icons/UsersIcon";
import CourseIcon from "@/components/icons/CourseIcon";
import InstructorIcon from "@/components/icons/InstructorIcon";

interface InstructorCardProps {
  instructor: Instructor;
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="bg-background border border-default-200" shadow="none">
      <CardHeader className="flex flex-col items-start w-full">
        <User
          avatarProps={{
            src: `${instructor.user.image ? `${IMAGE_BASE_URL}${instructor.user.image}` : undefined}`,
            // size: "lg",
            className: "w-16 h-16",
            radius: "md",
          }}
          classNames={{
            name: "font-semibold text-lg",
            base: "",
            wrapper: "flex flex-col",
          }}
          description={"Lead Developer"}
          name={`${instructor.user.firstName} ${instructor.user.lastName}`}
        />
      </CardHeader>
      <CardBody className="py-0 gap-2">
        <p className="w-full line-clamp-4 break-words">{instructor.user.bio}</p>
        <div className="flex flex-col gap-1 text-default-700 text-small">
          <p className="flex gap-2 items-center">
            <span>
              <InstructorIcon width={20} />
            </span>{" "}
            {instructor.sessionsConducted} sessions conducted
          </p>
          <div className="flex h-6 overflow-hidden items-center space-x-4">
            <p className="flex gap-2 items-center">
              {" "}
              <span>
                <CourseIcon width={20} />
              </span>{" "}
              {instructor.totalCourses} Courses
            </p>
            <Divider orientation="vertical" />
            <p className="flex gap-2 items-center">
              <UsersIcon width={20} />
              {instructor.totalLearners} Learners
            </p>
          </div>
        </div>
      </CardBody>
      <CardFooter>
        <Button
          className="ml-auto"
          color="primary"
          size="sm"
          onPress={() => {
            navigate({ to: `/instructors/${instructor.user.id}` });
          }}
        >
          Learn more..
        </Button>
      </CardFooter>
    </Card>
  );
}
