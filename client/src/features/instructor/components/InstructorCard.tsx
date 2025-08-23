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
  instructor: InstructorProfile;
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="bg-background border border-default-200" shadow="none">
      <CardHeader className="flex flex-col items-start w-full">
        <User
          avatarProps={{
            src: `${instructor.image ? `${IMAGE_BASE_URL}${instructor.image}` : undefined}`,
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
          name={`${instructor.firstName} ${instructor.lastName}`}
        />
      </CardHeader>
      <CardBody className="py-0 gap-2">
        <div>
          <p className=" w-full line-clamp-6">
            {" "}
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex
            repellendus rem accusamus libero distinctio beatae.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-default-700 text-small">
          <p className="flex gap-2 items-center">
            <span>
              <InstructorIcon width={20} />
            </span>{" "}
            132 sessions conducted
          </p>
          <div className="flex h-6 overflow-hidden items-center space-x-4">
            <p className="flex gap-2 items-center">
              {" "}
              <span>
                <CourseIcon width={20} />
              </span>{" "}
              12 Courses
            </p>
            <Divider orientation="vertical" />
            <p className="flex gap-2 items-center">
              <UsersIcon width={20} />
              1102 Learners
            </p>
          </div>
        </div>
      </CardBody>
      <CardFooter>
        {/* {instructor.sessionPricing ? ( */}
        <p className="text-xl font-semibold">
          ${instructor.sessionPricing?.price}/hr
        </p>
        {/* ) : null} */}
        <Button
          className="ml-auto"
          color="primary"
          size="sm"
          onPress={() => {
            navigate({ to: `/instructors/${instructor.id}` });
          }}
        >
          Learn more..
        </Button>
      </CardFooter>
    </Card>
  );
}
