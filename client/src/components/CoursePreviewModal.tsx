import { Accordion, AccordionItem } from "@heroui/accordion";
import { Card, CardBody } from "@heroui/card";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { BookOpen } from "lucide-react";
import React from "react";

import VideoPlayer from "./VideoPlayer";

interface CoursePreviewModalProps {
  isOpen: boolean;
  course: Course;
  onClose: () => void;
}

export default function CoursePreviewModal({
  isOpen,
  onClose,
  course,
}: CoursePreviewModalProps) {
  const [activeLesson, setActiveLesson] = React.useState<Lesson>();

  React.useEffect(() => {
    const activeLesson = findFirstPreviewLesson(course);

    if (activeLesson) {
      setActiveLesson(activeLesson);
    }
  }, []);

  function findFirstPreviewLesson(course: Course) {
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        if (lesson.preview && lesson.video) {
          return lesson;
        }
      }
    }

    return null;
  }

  return (
    <Modal
      backdrop="blur"
      classNames={{
        base: `dark:bg-background bg-secondary-500`,
        backdrop: "dark:bg-secondary-600/10",
      }}
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onClose}
    >
      <ModalContent key={course.id}>
        {() => (
          <>
            <ModalHeader className="flex  flex-col gap-1">
              {course.title}
            </ModalHeader>
            <ModalBody>
              <Card
                className={`${!activeLesson ? "min-h-44 flex justify-center items-center" : ""}  `}
              >
                {activeLesson ? (
                  <VideoPlayer videoId={activeLesson?.id as string} />
                ) : (
                  <p>No preview videos available for this course</p>
                )}
              </Card>
              <Accordion>
                {course.sections.map((section) => (
                  <AccordionItem
                    key={section.id}
                    aria-label={section.title}
                    classNames={{
                      title: "text-lg font-semibold capitalize",
                      trigger: "p-4",
                    }}
                    title={section.title}
                  >
                    {(section.lessons || []).map((lesson, i) => (
                      <div
                        key={lesson.id}
                        className={`p-2 ${i === 0 ? "pt-0" : ""}`}
                      >
                        <div>
                          <Card
                            isPressable
                            className="w-full"
                            isDisabled={!lesson.preview}
                            shadow="sm"
                            onPress={() => {
                              if (lesson.preview) {
                                setActiveLesson(lesson);
                              }
                            }}
                          >
                            <CardBody>
                              <div className="flex gap-2 text-sm items-center capitalize font-medium">
                                <div className="rounded-full w-6 h-6 flex justify-center items-center bg-secondary">
                                  {i + 1}
                                </div>
                                <BookOpen size={16} />
                                <p>{lesson.title}</p>
                              </div>
                            </CardBody>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </AccordionItem>
                ))}
              </Accordion>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
