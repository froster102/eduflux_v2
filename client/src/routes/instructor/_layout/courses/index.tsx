import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import debounce from "lodash.debounce";
import React from "react";
import { Pagination } from "@heroui/pagination";
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
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const createCourse = useCreateCourse();
  const navigate = useNavigate();

  const { data, isLoading } = useGetInstructorCourses({
    page,
    limit: 10,
    searchFields: ["title"],
    searchQuery,
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

  const totalPages = data ? Math.ceil(data.total / 10) : 0;

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
                courses={data!.courses}
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
        <div className="flex justify-center pt-4 items-center gap-2">
          {data && data.total ? (
            <>
              <Button
                className="mr-2"
                color="primary"
                size="sm"
                variant="flat"
                onPress={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
              >
                Previous
              </Button>
              <Pagination
                color="primary"
                page={page}
                total={totalPages}
                onChange={setPage}
              />
              <div className="flex gap-2">
                <Button
                  color="primary"
                  size="sm"
                  variant="flat"
                  onPress={() =>
                    setPage((prev) => (prev < totalPages ? prev + 1 : prev))
                  }
                >
                  Next
                </Button>
              </div>
            </>
          ) : null}
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
