import { Divider } from "@heroui/divider";
import { createFileRoute } from "@tanstack/react-router";
import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";

import {
  useGetInstructorCourse,
  useGetInstructorCourseCurriculum,
  useUpdateInstructorCourse,
} from "@/features/instructor/courses/hooks/queries";
import DroppableCurriculumItems from "@/features/instructor/courses/components/DroppableCurriculumItems";
import CourseForm from "@/features/instructor/courses/components/forms/CourseForm";

export const Route = createFileRoute(
  "/instructor/_layout/courses/$courseId/manage",
)({
  component: Manage,
});

function Manage() {
  const { courseId } = Route.useParams();
  const { data: courseInfo, isLoading: isCourseInfoLoading } =
    useGetInstructorCourse(courseId);
  const { data: courseCurriculum, isLoading: isCourseCurriculumLoading } =
    useGetInstructorCourseCurriculum(courseId);
  const updateCourse = useUpdateInstructorCourse();

  function onSubmitHandler(data: UpdateCourseFormData) {
    updateCourse.mutate({
      id: courseId,
      updateData: data,
    });
  }

  return (
    <div className="h-full overflow-y-scroll scrollbar-hide">
      <div className="flex justify-between">
        <div>
          <p className="text-2xl font-bold">Course Setup</p>
          <small className="text-default-500 text-sm">
            Below you can setup your info and curriculum
          </small>
        </div>
        <div className="self-end">
          <Button color="primary">Submit for Review</Button>
        </div>
      </div>
      <div className="py-4">
        <Divider />
      </div>
      <Tabs fullWidth aria-label="Options">
        <Tab key="course-info" title="Course Info">
          <div className="flex justify-between w-full h-full gap-4">
            {isCourseInfoLoading ? (
              <p>Loading...</p>
            ) : (
              <CourseForm
                initialValues={
                  courseInfo
                    ? {
                        categoryId: courseInfo.categoryId,
                        title: courseInfo.title,
                        description: courseInfo.description,
                        isFree: courseInfo.isFree,
                        level: courseInfo.level,
                        price: courseInfo.price,
                        thumbnail: courseInfo.thumbnail,
                      }
                    : {}
                }
                onSubmitHandler={onSubmitHandler}
              />
            )}
          </div>
        </Tab>
        <Tab key="curriculum" title="Curriculum">
          <div className="pt-4 w-full h-full">
            {isCourseCurriculumLoading ? (
              <p>Loading...</p>
            ) : (
              courseCurriculum && (
                <DroppableCurriculumItems
                  courseId={courseId}
                  curriculumItems={courseCurriculum.data}
                />
              )
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
