import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { Tooltip } from "@heroui/tooltip";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { SearchIcon } from "lucide-react";

import { useGetCoursesByIds } from "../../courses/hooks/queries";
import {
  useAssignCourseMutation,
  useRemoveCourseMutation,
} from "../hooks/mutations";

import { useGetAllAvailableCoursesQuery } from "@/features/student/courses/hooks/queries";

interface TutorCoursesProps {
  user: User;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
}

export default function TutorCourses({
  page,
  pageSize,
  setPage,
  user,
}: TutorCoursesProps) {
  const enableGetCoursesQuery = (user.tutor?.courses || []).length > 0 || false;
  const [coursePage] = React.useState(1);
  const [coursePageSize] = React.useState(5);
  const [courseSeachKey] = React.useState("title");
  const [courseSeachQuery, setCourseSearchQuery] = React.useState("");
  const {
    data: assignedCourses,
    isLoading: isAssignedCoursesLoading,
    isFetching: isAssignedCoursesFetching,
  } = useGetCoursesByIds(
    user.tutor?.courses || [],
    { page, pageSize },
    enableGetCoursesQuery,
  );
  const [selectCourse, setSelectCourse] = React.useState(false);
  const { data: courseData, isLoading: isCoursesLoading } =
    useGetAllAvailableCoursesQuery({
      page: coursePage,
      pageSize: coursePageSize,
      searchKey: courseSeachKey,
      searchQuery: courseSeachQuery,
    });

  const assignCourseMutation = useAssignCourseMutation();
  const removeCourseMutation = useRemoveCourseMutation();

  function handleCourseAssign(courseId: string) {
    assignCourseMutation.mutate({
      userId: user.id,
      courseId,
    });
  }

  React.useEffect(() => {
    console.log(page);
  }, [page]);

  return (
    <Card className="bg-background">
      <CardHeader className="flex justify-between items-center">
        <span className="font-semibold text-base">Assigned Courses</span>
        {selectCourse ? (
          <Autocomplete
            aria-label="Select an course"
            classNames={{
              base: "max-w-xs",
              listboxWrapper: "max-h-[320px]",
              selectorButton: "text-default-500",
            }}
            endContent={
              <Button
                className="bg-transparent"
                isIconOnly={true}
                radius="full"
                size="sm"
                startContent={
                  <Icon icon="solar:close-circle-line-duotone" width={20} />
                }
                onPress={() => setSelectCourse(false)}
              />
            }
            inputProps={{
              classNames: {
                input: "ml-1",
                inputWrapper: "h-[48px]",
              },
            }}
            inputValue={courseSeachQuery}
            isLoading={isCoursesLoading}
            items={courseData?.courses || []}
            listboxProps={{
              hideSelectedIcon: true,
              itemClasses: {
                base: [
                  "rounded-medium",
                  "text-default-500",
                  "transition-opacity",
                  "data-[hover=true]:text-foreground",
                  "dark:data-[hover=true]:bg-default-50",
                  "data-[pressed=true]:opacity-70",
                  "data-[hover=true]:bg-default-200",
                  "data-[selectable=true]:focus:bg-default-100",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              },
            }}
            placeholder="Search with course title"
            popoverProps={{
              offset: 10,
              classNames: {
                base: "rounded-large",
                content: "p-1 border-small border-default-100 bg-background",
              },
            }}
            radius="full"
            size="sm"
            startContent={
              <SearchIcon
                className="text-default-400"
                size={20}
                strokeWidth={2.5}
              />
            }
            variant="bordered"
            onInputChange={setCourseSearchQuery}
            onSelectionChange={(value) => {
              if (value) {
                handleCourseAssign(value as string);
                setSelectCourse(false);
              }
            }}
          >
            {(course) => (
              <AutocompleteItem key={course.id} textValue={course.title}>
                <div className="flex justify-between items-center">
                  <p>{course.title}</p>
                  <Button
                    className="border-small mr-0.5 font-medium shadow-small"
                    radius="full"
                    size="sm"
                    variant="bordered"
                  >
                    Add
                  </Button>
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>
        ) : (
          <Button
            className="text-xs"
            isDisabled={assignCourseMutation.isPending}
            isLoading={assignCourseMutation.isPending}
            size="sm"
            onPress={() => setSelectCourse(true)}
          >
            Assign Course
          </Button>
        )}
      </CardHeader>
      <Divider />
      <CardBody className="p-2 max-h-60 overflow-y-auto">
        {isAssignedCoursesLoading || isAssignedCoursesFetching ? (
          <Spinner className="p-4" variant="simple" />
        ) : assignedCourses?.courses?.length ? (
          assignedCourses.courses.map((course) => (
            <Card key={course.id} className="p-2 mb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">{course.title}</span>
                <Tooltip closeDelay={50} content="Remove">
                  <Button
                    isIconOnly
                    className="bg-transparent"
                    radius="full"
                    size="sm"
                    startContent={
                      <Icon icon="solar:close-circle-outline" width={24} />
                    }
                    onPress={() => {
                      removeCourseMutation.mutate({
                        userId: user.id,
                        courseId: course.id,
                      });
                      setPage(1);
                    }}
                  />
                </Tooltip>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-sm text-gray-500">No assigned courses found.</p>
        )}
      </CardBody>
      {assignedCourses?.total && assignedCourses.total > pageSize ? (
        <CardFooter className="flex justify-center">
          <Pagination
            initialPage={page}
            total={Math.ceil(assignedCourses.total / pageSize)}
            onChange={setPage}
          />
        </CardFooter>
      ) : null}
    </Card>
  );
}
