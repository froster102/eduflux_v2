import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React from 'react';
import { Spinner } from '@heroui/spinner';
import { Tab, Tabs } from '@heroui/tabs';
import debounce from 'lodash.debounce';

import CoursesList from '@/features/course/components/CoursesList';
import { useGetSubsribedCourses } from '@/features/course/hooks/useGetSubsribedCourses';
import { useGetCourses } from '@/features/course/hooks/useGetCourses';
import SearchBox from '@/components/SearchBox';

export const Route = createFileRoute('/_layout/courses/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [currentTab, setCurrentTab] = React.useState<
    'all-courses' | 'my-courses'
  >('all-courses');

  const navigate = useNavigate();

  const { data: subscribedCourses, isLoading: isSubscribedCoursesLoading } =
    useGetSubsribedCourses({
      paginationQueryParams: {
        page: {
          number: page,
          size: 8,
        },
      },
      enabled: currentTab === 'my-courses',
    });

  const { data: allCourses, isLoading: isAllCoursesLoading } = useGetCourses({
    page: {
      number: page,
      size: 8,
    },
    filter: {
      instructor: search,
    },
  });

  const courses =
    currentTab === 'all-courses' && !isAllCoursesLoading
      ? allCourses
      : currentTab === 'my-courses' && !isSubscribedCoursesLoading
        ? subscribedCourses
        : 0;

  const totalPages = courses ? courses.meta.totalPages : 0;

  const onPressHanlder = (course: Course) => {
    navigate({ to: `/courses/${course.id}` });
  };

  const debouncedSearch = React.useMemo(
    () =>
      debounce((query: string) => {
        setPage(1);
        setSearch(query);
      }, 300),
    [setSearch, setPage],
  );

  return (
    <div className="w-full">
      <div>
        <Tabs
          aria-label="Course Tabs"
          className="pt-2"
          variant="underlined"
          onSelectionChange={(value) => {
            setCurrentTab(value as 'all-courses' | 'my-courses');
          }}
        >
          <Tab key="all-courses" title="All course">
            <div className="w-full h-full pt-2">
              {isAllCoursesLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (
                <>
                  <div className="flex flex-col w-full gap-4">
                    <div className="flex items-center gap-2">
                      <SearchBox
                        placeholder="Search by course title, instructor name"
                        value={search}
                        onValueChange={debouncedSearch}
                      />
                    </div>
                    <CoursesList
                      courses={allCourses!.data}
                      currentPage={page}
                      totalPages={totalPages}
                      type="all-course"
                      onCoursePress={onPressHanlder}
                      onPageChange={(page) => setPage(page)}
                    />
                  </div>
                </>
              )}
            </div>
          </Tab>
          <Tab key="my-courses" title="My courses">
            <div className="w-full h-full pt-4">
              {isSubscribedCoursesLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (
                <CoursesList
                  courses={subscribedCourses?.data ?? []}
                  currentPage={page}
                  totalPages={totalPages}
                  type="my-courses"
                  onCoursePress={(course) => {
                    navigate({ to: `/courses/${course.id}/learn` });
                  }}
                  onPageChange={(page) => setPage(page)}
                />
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
