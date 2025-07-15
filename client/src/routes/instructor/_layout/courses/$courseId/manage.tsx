import { Divider } from "@heroui/divider";
import { createFileRoute } from "@tanstack/react-router";
import { Tabs, Tab } from "@heroui/tabs";
import React from "react";

import {
  useGetInstructorCourse,
  useGetInstructorCourseCurriculum,
  useUpdateInstructorCourse,
} from "@/features/instructor/courses/hooks/queries";
import DroppableCurriculumItems from "@/features/instructor/courses/components/DroppableCurriculumItems";
import CourseForm from "@/features/instructor/courses/components/forms/CourseForm";
import { usePublishCourse } from "@/features/instructor/courses/hooks/mutations";
import CourseErrorModal from "@/features/instructor/courses/components/CourseErrorModal";

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
  const [openCourseErrorModal, setOpenCourseErrorModal] = React.useState<{
    isOpen: boolean;
    error: string;
  }>({ isOpen: false, error: "" });

  const publishCourse = usePublishCourse({
    onError: (error: string) => {
      setOpenCourseErrorModal({ isOpen: true, error });
    },
  });

  function onSubmitHandler(data: UpdateCourseFormData) {
    updateCourse.mutate({
      id: courseId,
      updateData: data,
    });
  }

  return (
    <div className="h-full">
      {/* <Button
        color="primary"
        isDisabled={publishCourse.isPending}
        isLoading={publishCourse.isPending}
        onPress={() => publishCourse.mutate(courseId)}
      >
        Publish
      </Button> */}
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

      <CourseErrorModal
        error={openCourseErrorModal.error}
        isOpen={openCourseErrorModal.isOpen}
        onClose={() => setOpenCourseErrorModal({ isOpen: false, error: "" })}
      />
    </div>
  );
}
