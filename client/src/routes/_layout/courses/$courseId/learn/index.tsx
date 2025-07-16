import { createFileRoute } from "@tanstack/react-router";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { Progress } from "@heroui/progress";
import { Accordion, AccordionItem } from "@heroui/accordion";
import React from "react";
import { Checkbox } from "@heroui/checkbox";
import { Spinner } from "@heroui/spinner";

import {
  useGetCourseInfo,
  useGetPublishedCourseCurriculum,
  useGetSubscribedCourseCurriculumItem,
} from "@/features/learner/courses/hooks/queries";
import HLSPlayer from "@/components/HLSPlayer";

export const Route = createFileRoute("/_layout/courses/$courseId/learn/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseId } = Route.useParams();
  const { data: courseInfo, isLoading: isCourseInfoLoading } =
    useGetCourseInfo(courseId);
  const { data: courseCurriculum, isLoading: isCourseCurriculumLoading } =
    useGetPublishedCourseCurriculum(courseId);
  const [selectedCurriculumItem, setSelectedCurriculumItem] =
    React.useState<CurriculumItem | null>(null);
  const { data: itemContent, isLoading: isItemContentLoading } =
    useGetSubscribedCourseCurriculumItem(selectedCurriculumItem);

  React.useEffect(() => {
    if (courseCurriculum) {
      setSelectedCurriculumItem(courseCurriculum[1]);
    }
  }, [courseCurriculum]);

  function findChapterItems(
    curriculumItems: CurriculumItems,
    chapterIndex: number,
  ): CurriculumItems {
    const itemsForChapter: CurriculumItems = [];

    for (let i = chapterIndex + 1; i < curriculumItems.length; i++) {
      const currentItem = curriculumItems[i];

      if (currentItem && currentItem._class === "chapter") {
        break;
      }
      if (currentItem) {
        itemsForChapter.push(currentItem);
      }
    }

    return itemsForChapter;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full pt-2">
      <Card className="w-full h-fit overflow-hidden">
        <CardBody className="p-0 border border-default-200">
          {isItemContentLoading ? (
            <Spinner />
          ) : itemContent && itemContent!._class === "lecture" ? (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              {" "}
              {/* 16:9 aspect ratio */}
              <div className="absolute top-0 left-0 w-full h-full">
                <HLSPlayer
                  options={{
                    sources: itemContent!.asset?.mediaSources!,
                    autoplay: true,
                    controls: true,
                    responsive: true,
                    fluid: true,
                  }}
                />
              </div>
            </div>
          ) : null}
        </CardBody>
      </Card>
      <Card className="lg:max-w-md border border-default-200 bg-background w-full">
        <CardHeader className="flex flex-col">
          {isCourseInfoLoading ? (
            <Skeleton className="rounded-md h-[5vh] w-full">
              Course Title
            </Skeleton>
          ) : (
            <p className="font-semibold text-xl">{courseInfo!.title}</p>
          )}
          <div className="pt-2 w-full flex items-center gap-2">
            <Progress aria-label="Loading..." className="max-w-md" value={60} />
            60%
          </div>
        </CardHeader>
        <CardBody>
          <p className="font-medium text-lg pl-2 pb-2">Modules</p>
          {isCourseCurriculumLoading ? (
            <Skeleton>Modules</Skeleton>
          ) : (
            <Accordion>
              {courseCurriculum!.map((item, i) => {
                if (item._class === "chapter") {
                  const chapterItems = findChapterItems(courseCurriculum!, i);

                  return (
                    <AccordionItem
                      key={item.id}
                      aria-label={`Chapter ${item.objectIndex} : ${item.title}`}
                      className="bg-background border border-default-200"
                      startContent={
                        <div className="flex items-center justify-center bg-primary text-black h-6 w-6 text-sm rounded-full flex-shrink-0">
                          {item.objectIndex}
                        </div>
                      }
                      title={`${item.title}`}
                      variant="splitted"
                    >
                      {chapterItems.length > 0
                        ? chapterItems.map((chapterItem, i) => (
                            <div
                              key={chapterItem.id}
                              className={`${i !== 0 ? "pt-2" : ""}`}
                            >
                              <Card
                                isPressable
                                className="w-full"
                                onPress={() =>
                                  setSelectedCurriculumItem(chapterItem)
                                }
                              >
                                <CardBody>
                                  <div className="flex">
                                    <Checkbox defaultSelected={false} />
                                    <p>
                                      {chapterItem.objectIndex}.
                                      {chapterItem.title}
                                    </p>
                                  </div>
                                </CardBody>
                              </Card>
                            </div>
                          ))
                        : null}
                    </AccordionItem>
                  );
                } else {
                  return <React.Fragment key={item.id} />;
                }
              })}
            </Accordion>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
