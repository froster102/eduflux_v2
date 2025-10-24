import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import debounce from "lodash.debounce";
import React from "react";
import { Spinner } from "@heroui/spinner";

import { SearchIcon } from "@/components/Icons";
import FormModal from "@/components/FormModal";
import { useCreateCourse } from "@/features/course/hooks/useCreateCourse";
import { useGetInstructorCourses } from "@/features/course/hooks/useGetInstructorCourses";
import CreateCourseForm from "@/features/course/components/forms/CreateCourseForm";
import CoursesList from "@/features/course/components/CoursesList";

export const Route = createFileRoute("/instructor/_layout/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const createCourse = useCreateCourse();
  const navigate = useNavigate();

  const { data, isLoading } = useGetInstructorCourses({
    page: {
      number: page,
      size: 10,
    },
  });

  const [openCreateCourseModal, setOpenCreateCourseModal] =
    React.useState(false);

  const debouncedSetSearchQuery = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
      }, 500),
    [],
  );

  const totalPages = data ? data.meta.totalPages : 0;

  function onCreateCourseHandler(data: CreateCourseFormData) {
    createCourse.mutate(data);
    setOpenCreateCourseModal(false);
  }

  function onPressHanlder(course: Course) {
    navigate({ to: `/instructor/courses/${course.id}/manage` });
  }

  return (
    <>
      <div className="w-full overflow-y-auto scrollbar-hide">
        <div className="flex pt-4 justify-between items-center">
          <Input
            isClearable
            className="w-full max-w-md"
            color="default"
            placeholder={`Search`}
            startContent={<SearchIcon />}
            onValueChange={debouncedSetSearchQuery}
          />
          <Button
            color="primary"
            onPress={() => setOpenCreateCourseModal(true)}
          >
            New Course
          </Button>
        </div>
        <div className="pt-4">
          {isLoading ? (
            <div className="flex w-full h-screen justify-center items-center">
              <Spinner />
            </div>
          ) : (
            data && (
              <CoursesList
                courses={data!.data}
                currentPage={page}
                isInstructorListing={true}
                totalPages={totalPages}
                type="all-course"
                onCoursePress={onPressHanlder}
                onPageChange={(page) => setPage(page)}
              />
            )
          )}
        </div>
      </div>

      <FormModal
        form={
          <CreateCourseForm
            isPending={createCourse.isPending}
            onCancel={() => setOpenCreateCourseModal(false)}
            onSubmitHandler={onCreateCourseHandler}
          />
        }
        isOpen={openCreateCourseModal}
        title={`Create your course`}
        onClose={() => setOpenCreateCourseModal(false)}
      />
    </>
  );
}
