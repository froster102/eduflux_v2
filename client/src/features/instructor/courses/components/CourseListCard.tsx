import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { useNavigate } from "@tanstack/react-router";

import { IMAGE_BASE_URL } from "@/config/image";

export default function CourseListCard({ course }: { course: Course }) {
  const navigate = useNavigate();

  return (
    <Card className="group relative" shadow="md">
      <div className="flex w-full transition-all duration-300 ease-in-out group-hover:filter group-hover:blur-sm">
        <div>
          <Image
            alt="Thumbnail"
            height={100}
            src={
              course.thumbnail
                ? `${IMAGE_BASE_URL}/${course.thumbnail}`
                : "/placeholder.png"
            }
            width={200}
          />
        </div>
        <div className="flex justify-between items-center w-full p-2 pr-4">
          <div className="flex flex-col gap-2">
            <div>
              <p className="font-semibold">{course.title}</p>
            </div>
            <div>
              <Chip
                className="capitalize"
                color={course.status === "published" ? "success" : "default"}
                variant="flat"
              >
                {course.status}
              </Chip>
            </div>
          </div>
          {/* <div>Earnings</div>
          <div>Enrollments</div>
          <div>Reviews</div> */}
        </div>
      </div>
      <div
        className="absolute inset-0 z-10 bg-opacity-40
                   opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 flex items-center pl-10"
      >
        <Button
          className="bg-transparent font-semibold text-lg"
          onPress={() =>
            navigate({
              to: `/instructor/courses/${course.id}/manage`,
            })
          }
        >
          Manage
        </Button>
      </div>
    </Card>
  );
}
