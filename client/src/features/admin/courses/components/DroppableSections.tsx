import { Card, CardBody } from "@heroui/card";
import { Edit, PlusIcon, Trash } from "lucide-react";
import { DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@heroui/button";

import SortableItem from "./SortableItem";
import SectionFormModal from "./AddSectionModal";
import ChapterFormModal from "./AddLessonModal";

import { useCourseStore } from "@/store/course-store";

export default function DroppableSections() {
  const {
    courseEditor,
    setSections,
    openLessonModal,
    openSectionModal,
    deleteSection,
    deleteLesson,
  } = useCourseStore();

  const { sections } = courseEditor;

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const isSectionDrag = active.id.startsWith("section:");
      const isLessonDrag = active.id.startsWith("lesson:");

      if (isSectionDrag) {
        const activeSectionIndex = sections.findIndex(
          (section) => section.id === active.id.replace("section:", ""),
        );
        const overSectionIndex = sections.findIndex(
          (section) => section.id === over.id.replace("section:", ""),
        );

        if (activeSectionIndex !== overSectionIndex) {
          const updateSections = arrayMove(
            sections,
            activeSectionIndex,
            overSectionIndex,
          );

          setSections(updateSections);
        }
      }

      if (isLessonDrag) {
        const sectionId = active.id.split(":")[2];
        const activeLessonId = active.id.split(":")[1].split("-")[0];
        const overLessonId = over.id.split(":")[1].split("-")[0];

        const sectionIndex = sections.findIndex(
          (section) => section.id === sectionId,
        );
        const section = sections[sectionIndex];

        const activeLessonIndex = section?.lessons.findIndex(
          (lesson) => lesson.id === activeLessonId,
        );

        const overLessonIndex = section.lessons.findIndex(
          (lesson) => lesson.id === overLessonId,
        );

        if (activeLessonIndex !== overLessonIndex) {
          const updatedLessons = arrayMove(
            section.lessons,
            activeLessonIndex,
            overLessonIndex,
          );

          const updatedSections = [...sections];

          updatedSections[sectionIndex] = {
            ...section,
            lessons: updatedLessons,
          };
          setSections(updatedSections);
        }
      }
    }
  }

  return (
    <>
      <Card
        className="w-full dark:bg-secondary-500 bg-secondary-200 h-full overflow-hidden"
        shadow="none"
      >
        <CardBody>
          <div className="flex justify-between item">
            <p className="text-lg font-semibold">Sections</p>
            <Button
              className="text-sm p-2 bg-transparent text-blue-700"
              size="sm"
              onPress={() => openSectionModal("add")}
            >
              Add section
              <PlusIcon />
            </Button>
          </div>
          <DndContext onDragEnd={handleDragEnd}>
            <div>
              <SortableContext
                items={sections.map((section) => `section:${section.id}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="w-full">
                  {sections.map((section) => (
                    <div key={section.id} className="p-2">
                      <SortableItem id={`section:${section.id}`}>
                        <Card className="w-full" shadow="sm">
                          <CardBody className="w-full">
                            <div className="flex justify-between">
                              <div>
                                <div>{section.title}</div>
                                <small className="text-default-500 text-sm">
                                  {section.description}
                                </small>
                              </div>
                              <div className="flex gap-2 items-start">
                                <Button
                                  isIconOnly
                                  radius="full"
                                  size="sm"
                                  onPress={() => {
                                    openSectionModal("edit", section);
                                  }}
                                >
                                  <Edit size={20} />
                                </Button>
                                <Button
                                  isIconOnly
                                  radius="full"
                                  size="sm"
                                  onPress={() => {
                                    deleteSection(section.id);
                                  }}
                                >
                                  <Trash size={20} />
                                </Button>
                              </div>
                            </div>
                            <SortableContext
                              items={(section.lessons || []).map(
                                (lesson) =>
                                  `lesson:${lesson.id}-section:${section.id}`,
                              )}
                              strategy={verticalListSortingStrategy}
                            >
                              <div>
                                {(section.lessons || []).map((lesson) => (
                                  <SortableItem
                                    key={lesson.id}
                                    id={`lesson:${lesson.id}-section:${section.id}`}
                                  >
                                    <div className="pt-2">
                                      <Card>
                                        <CardBody>
                                          <div className="flex justify-between">
                                            <div>{lesson.title}</div>
                                            <div className="flex gap-2 items-start">
                                              <Button
                                                size="sm"
                                                onPress={() => {
                                                  openLessonModal(
                                                    "edit",
                                                    section,
                                                    lesson,
                                                  );
                                                }}
                                              >
                                                <Edit />
                                              </Button>
                                              <Button
                                                size="sm"
                                                onPress={() => {
                                                  deleteLesson(
                                                    section.id,
                                                    lesson.id,
                                                  );
                                                }}
                                              >
                                                <Trash />
                                              </Button>
                                            </div>
                                          </div>
                                          <small className="text-default-500 text-sm min-h-[24px] overflow-ellipsis">
                                            {lesson.description}
                                          </small>
                                        </CardBody>
                                      </Card>
                                    </div>
                                  </SortableItem>
                                ))}
                                <div className="pt-2">
                                  <Button
                                    className="text-sm p-2 bg-transparent text-blue-700"
                                    size="sm"
                                    onPress={() =>
                                      openLessonModal("add", section)
                                    }
                                  >
                                    Add lesson
                                    <PlusIcon />
                                  </Button>
                                </div>
                              </div>
                            </SortableContext>
                          </CardBody>
                        </Card>
                      </SortableItem>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </div>
          </DndContext>
        </CardBody>
      </Card>
      {courseEditor.isSectionModalOpen && (
        <SectionFormModal isOpen={courseEditor.isSectionModalOpen} />
      )}
      {courseEditor.isLessonModalOpen && (
        <ChapterFormModal isOpen={courseEditor.isLessonModalOpen} />
      )}
    </>
  );
}
