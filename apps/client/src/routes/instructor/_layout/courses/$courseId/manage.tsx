import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Tabs, Tab } from '@heroui/tabs';

import DroppableCurriculumItems from '@/features/course/components/DroppableCurriculumItems';
import CourseErrorModal from '@/features/course/components/CourseErrorModal';
import { useGetInstructorCourse } from '@/features/course/hooks/useGetInstructorCourse';
import { useGetInstructorCourseCurriculum } from '@/features/course/hooks/useGetInstructorCourseCurriculum';
import { useUpdateInstructorCourse } from '@/features/course/hooks/useUpdateCourse';
import { usePublishCourse } from '@/features/course/hooks/usePublishCourse';
import CourseForm from '@/features/course/components/forms/CourseForm';
import { CourseLevel } from '@/shared/enums/CourseLevel';

export const Route = createFileRoute(
  '/instructor/_layout/courses/$courseId/manage',
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
  }>({ isOpen: false, error: '' });

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

  function onPublishHandler() {
    publishCourse.mutate(courseId);
  }

  return (
    <div className="h-full">
      <Tabs fullWidth aria-label="Options">
        <Tab key="course-info" title="Course Info">
          <div className="flex justify-between w-full h-full gap-4">
            {isCourseInfoLoading ? (
              <p>Loading...</p>
            ) : (
              <CourseForm
                initialValues={
                  courseInfo?.data
                    ? {
                        categoryId: courseInfo.data.categoryId,
                        title: courseInfo.data.title,
                        description: courseInfo.data.description,
                        isFree: courseInfo.data.isFree,
                        level: courseInfo.data.level || CourseLevel.BEGINNER,
                        price: courseInfo.data.price,
                        thumbnail: courseInfo.data.thumbnail,
                      }
                    : {}
                }
                isPublished={courseInfo?.data?.status === 'published'}
                isPublishing={publishCourse.isPending}
                onPublishHandler={onPublishHandler}
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
        onClose={() => setOpenCourseErrorModal({ isOpen: false, error: '' })}
      />
    </div>
  );
}
