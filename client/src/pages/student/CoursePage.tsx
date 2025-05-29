import { Divider } from "@heroui/divider";
import { useParams } from "react-router";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { Accordion, AccordionItem } from "@heroui/accordion";
import React from "react";
import { BookOpen } from "lucide-react";
import { CircularProgress } from "@heroui/progress";
import { Checkbox } from "@heroui/checkbox";
import { Selection } from "@heroui/table";

import { useAuthStore } from "@/store/auth-store";
import { useGetEnrolledCourseQuery } from "@/features/student/courses/hooks/queries";
import VideoPlayer from "@/components/VideoPlayer";
import {
  useLessonCompletionMutation,
  useLessonCompletionUnmarkMutation,
} from "@/features/student/progress/hooks/mutations";
import { useGetCourseProgressQuery } from "@/features/student/progress/hooks/queries";

export default function CoursePage() {
  const { courseId } = useParams() as { courseId: string };
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set());

  const {
    user: { userId },
  } = useAuthStore();
  const { data: courseData, isLoading } = useGetEnrolledCourseQuery(
    userId,
    courseId as string,
  );
  const [activeSection, setActiveSection] = React.useState<Section | null>(
    null,
  );
  const { data: progress, isLoading: isProgressLoading } =
    useGetCourseProgressQuery(courseId, userId);
  const [activeLesson, setActiveLesson] = React.useState<Lesson | null>(null);

  const totalLessons = React.useMemo(() => {
    if (!courseData) return 0;

    return courseData.sections.reduce(
      (acc, section) => acc + (section.lessons?.length || 0),
      0,
    );
  }, [courseData]);

  React.useEffect(() => {
    if (!isLoading && courseData) {
      setActiveLesson(courseData.sections[0].lessons[0]);
      setActiveSection(courseData.sections[0]);
      setSelectedKeys(new Set([courseData.sections[0].id]));
    }

    return () => {
      setActiveLesson(null);
      setActiveSection(null);
      setSelectedKeys(new Set());
    };
  }, [isLoading]);

  const lessonCompletionMutation = useLessonCompletionMutation(totalLessons);
  const lessonCompletionUnmarkMutation =
    useLessonCompletionUnmarkMutation(totalLessons);

  const handleVideoEnd = React.useCallback(() => {
    if (activeLesson && activeSection) {
      const lessonProgress = findLessonProgress(activeLesson.id);

      if (!lessonProgress || !lessonProgress.isCompleted) {
        lessonCompletionMutation.mutate({
          courseId,
          userId,
          lessonId: activeLesson.id,
          sectionId: activeSection.id,
        });
      }

      const nextLessonWithSection = findNextLessonWithSection(
        activeLesson,
        activeSection,
      );

      if (nextLessonWithSection) {
        const { lesson, section } = nextLessonWithSection;

        setActiveLesson(lesson);
        setActiveSection(section);

        setSelectedKeys(new Set([section.id]));
      }
    }
  }, [activeLesson, activeSection, courseId, userId, progress]);

  function findLessonProgress(lessonId: string) {
    if (progress && !isProgressLoading) {
      const lessonProgress = progress.completedLessons.find(
        (lesson) => lesson.lessonId === lessonId,
      );

      if (lessonProgress) {
        return lessonProgress;
      }
    }

    return null;
  }

  function findNextLessonWithSection(
    activeLesson: Lesson,
    activeSection: Section,
  ) {
    if (!courseData) return null;

    const sections = courseData.sections;
    const sectionIndex = sections.findIndex(
      (section) => section.id === activeSection.id,
    );

    if (sectionIndex === -1) return null;

    const lessons = courseData.sections[sectionIndex].lessons || [];
    const lessonIndex = lessons.findIndex(
      (lesson) => lesson.id === activeLesson.id,
    );

    if (lessonIndex === -1) return null;

    if (lessonIndex + 1 < lessons.length) {
      return {
        lesson: lessons[lessonIndex + 1],
        section: sections[sectionIndex],
      };
    }

    for (let i = sectionIndex + 1; i < sections.length; i++) {
      const nextSection = sections[i];

      if (nextSection.lessons && nextSection.lessons.length > 0) {
        return {
          lesson: nextSection.lessons[0],
          section: nextSection,
        };
      }
    }

    return null;
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="rounded-md" isLoaded={!isLoading}>
            <p className="text-3xl font-bold capitalize">{courseData?.title}</p>
          </Skeleton>
          <small className="text-sm text-default-500">List of courses</small>
        </div>
        {/* <Button className="bg-zinc-950 text-zinc-100">Start now</Button> */}
        <div className="flex items-center">
          <Skeleton isLoaded={!isProgressLoading}>
            <CircularProgress
              aria-label="Progress"
              color="success"
              showValueLabel={true}
              size="lg"
              value={progress?.completionPercentage}
            />
          </Skeleton>
          <p className="text-sm pl-2">Your progress</p>
        </div>
      </div>
      <Divider className="mt-4" orientation="horizontal" />
      <div className="md:grid grid-rows-3 md:grid-rows-1  md:grid-cols-6 w-full h-full gap-2 p-2">
        <div className="md:col-span-4 w-full overflow-x-scroll scroll-smooth scrollbar-hide">
          <div className="w-full h-[70%]">
            <Card className="bg-background" radius="sm" shadow="none">
              <CardBody className="p-0">
                <div className="overflow-hidden">
                  {activeLesson && (
                    <VideoPlayer
                      videoId={activeLesson.id}
                      onVideoEnd={handleVideoEnd}
                    />
                  )}
                </div>
              </CardBody>
            </Card>
            <div className="hidden md:block pt-2">
              <Card className="bg-background h-full" radius="sm" shadow="none">
                <CardHeader className="font-semibold text-xl capitalize">
                  {activeLesson?.title}
                </CardHeader>
                <CardBody>{activeLesson?.description}</CardBody>
              </Card>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 w-full h-full">
          <Card className="bg-background h-full" radius="sm" shadow="none">
            <CardHeader className="font-bold text-lg">
              Course Content
            </CardHeader>
            <Divider orientation="horizontal" />
            <CardBody className="px-0">
              <Accordion selectedKeys={selectedKeys}>
                {courseData
                  ? (courseData.sections || []).map((section) => (
                      <AccordionItem
                        key={section.id}
                        aria-label={section.title}
                        classNames={{
                          title: "text-lg font-semibold capitalize",
                          trigger: "p-4",
                        }}
                        title={section.title}
                        onPress={() => {
                          setActiveSection(section);
                          setSelectedKeys(new Set([section.id]));
                        }}
                      >
                        {(section.lessons || []).map((lesson, i) => (
                          <div
                            key={lesson.id}
                            className={`p-2 ${i === 0 ? "pt-0" : ""}`}
                          >
                            <div>
                              <Card
                                isPressable
                                className={`w-full ${activeLesson && activeLesson.id === lesson.id ? "bg-secondary-500 dark:bg-default-300" : ""}`}
                                shadow="sm"
                                onPress={() => {
                                  setActiveLesson(lesson);
                                  setActiveSection(section);
                                }}
                              >
                                <CardBody>
                                  <div className="flex gap-2 text-sm items-center justify-between overflow-hidden capitalize font-medium">
                                    <div className="flex gap-2 items-center">
                                      <div className="rounded-full w-6 h-6 flex justify-center items-center bg-secondary">
                                        {i + 1}
                                      </div>
                                      <BookOpen size={16} />
                                      <p>{lesson.title}</p>
                                    </div>
                                    <Checkbox
                                      aria-label="Mark or Unmark lesson as complete"
                                      isSelected={
                                        !!progress?.completedLessons.find(
                                          (completedLesson) =>
                                            completedLesson.lessonId ===
                                            lesson.id,
                                        )?.isCompleted
                                      }
                                      onValueChange={(value) => {
                                        if (value === true) {
                                          lessonCompletionMutation.mutate({
                                            courseId,
                                            lessonId: lesson.id,
                                            sectionId: section.id,
                                            userId,
                                          });
                                        } else {
                                          lessonCompletionUnmarkMutation.mutate(
                                            {
                                              courseId,
                                              lessonId: lesson.id,
                                              sectionId: section.id,
                                              userId,
                                            },
                                          );
                                        }
                                      }}
                                    />
                                  </div>
                                </CardBody>
                              </Card>
                            </div>
                          </div>
                        ))}
                      </AccordionItem>
                    ))
                  : null}
              </Accordion>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
