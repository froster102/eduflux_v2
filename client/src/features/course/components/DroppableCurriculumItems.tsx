import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

import { useCurriculumStore } from "@/store/curriculum-store";
import FormModal from "@/components/FormModal";
import { tryCatch } from "@/utils/try-catch";

import { useCreateLecture } from "../hooks/useCreateLecture";
import { useUpdateLecture } from "../hooks/useUpdateLecture";
import { useDeleteLecture } from "../hooks/useDeleteLecture";
import { useCreateChapter } from "../hooks/useCreateChapter";
import { useUpdateChapter } from "../hooks/useUpdateChapter";
import { useDeleteChapter } from "../hooks/useDeleteChapter";
import { useAddContentToLecture } from "../hooks/useAddContentToLecture";
import { useUpdateCurriculumItems } from "../hooks/useUpdateCurriculumItems";

import SortableItem from "./SortableItem";
import SortableChapterItem from "./SortableChapterItem";
import SortableLectureItem from "./SortableLectureItem";
import LectureForm from "./forms/LectureForm";
import ChapterForm from "./forms/ChapterForm";
import FileUploadModal from "./FileUploadModal";

interface DroppableCurriculumItemsProps {
  courseId: string;
  curriculumItems: CurriculumItem[];
}

export default function DroppableCurriculumItems({
  courseId,
  curriculumItems: initialCurriculumItems,
}: DroppableCurriculumItemsProps) {
  const {
    activeId,
    curriculumItems,
    setCurriculumItems,
    setActiveId,
    setActiveItem,
    activeItem,
    setOpenChapterFormModal,
    reArrangeCurriculumItems,
    reOrderCurriculumItems,
    openChapterFormModal,
    openLectureFormModal,
    selectedIndex,
    setSelectedIndex,
    deleteChapterItem,
    updateChapterItem,
    selectedChapter,
    selectedLecture,
    setSelectedChapter,
    setOpenLectureFormModal,
    setSelectedLecture,
    updateLectureItem,
    insertCurriculumItem,
    deleteLectureItem,
    openFileUploadModal,
    setOpenFileUploadModal,
  } = useCurriculumStore();
  const createLecture = useCreateLecture();
  const updateLecture = useUpdateLecture();
  const deleteLecture = useDeleteLecture();
  const createChapter = useCreateChapter();
  const updateChapter = useUpdateChapter();
  const deleteChapter = useDeleteChapter();
  const addContentToLecture = useAddContentToLecture();

  React.useEffect(() => {
    if (initialCurriculumItems) {
      setCurriculumItems(initialCurriculumItems);
    }
  }, [initialCurriculumItems]);

  const updateCurriculumItems = useUpdateCurriculumItems();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  function syncCurriculumOrder() {
    updateCurriculumItems.mutate({
      courseId,
      items: useCurriculumStore.getState().curriculumItems.map((item) => ({
        id: item.id,
        class: item._class,
      })),
    });
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
    const activeItem = curriculumItems.find(
      (item) => item.id === (event.active.id as string),
    );

    setActiveItem(activeItem ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);

    if (active.id !== over?.id) {
      reArrangeCurriculumItems(active.id.toString(), over?.id.toString());
      reOrderCurriculumItems();
      syncCurriculumOrder();
    }
  }

  async function lectureOnSubmitHandler(data: LectureFormData) {
    if (openLectureFormModal.mode === "create") {
      const { data: newLecture } = await tryCatch(
        createLecture.mutateAsync({ ...data, courseId }),
      );

      if (newLecture && selectedIndex) {
        insertCurriculumItem(newLecture, selectedIndex);
        reOrderCurriculumItems();
        syncCurriculumOrder();
      }
    } else if (openLectureFormModal.mode === "edit") {
      if (selectedLecture && selectedIndex) {
        const { error } = await tryCatch(
          updateLecture.mutateAsync({
            ...data,
            lectureId: selectedLecture.id,
            courseId,
          }),
        );

        if (!error) {
          if (selectedLecture._class === "lecture") {
            updateLectureItem({ ...selectedLecture, ...data }, selectedIndex);
          }
        }
      }
    }
    setOpenLectureFormModal({ ...openLectureFormModal, isOpen: false });
  }

  async function chapterFormSubmitHandler(data: ChapterFormData) {
    if (openChapterFormModal.mode === "create") {
      const { data: chapter } = await tryCatch(
        createChapter.mutateAsync({ ...data, courseId }),
      );

      if (data) {
        if (selectedIndex) {
          insertCurriculumItem(chapter, selectedIndex);
          reOrderCurriculumItems();
          syncCurriculumOrder();
        }
      }
    } else if (openChapterFormModal.mode === "edit") {
      if (selectedChapter && selectedIndex) {
        await tryCatch(
          updateChapter.mutateAsync({
            courseId,
            ...data,
            chapterId: selectedChapter.id,
          }),
        );
        updateChapterItem({ ...selectedChapter, ...data }, selectedIndex);
      }
    }
    setOpenChapterFormModal({ ...openChapterFormModal, isOpen: false });
  }

  function handleEditLecture(lecture: Lecture, index: number) {
    setSelectedLecture(lecture);
    setSelectedIndex(index);
    setOpenLectureFormModal({
      mode: "edit",
      isOpen: true,
    });
  }

  function handleCreateLecture(selectedIndex: number) {
    setSelectedIndex(selectedIndex);
    setOpenLectureFormModal({ mode: "create", isOpen: true });
  }

  async function handleDeleteLecture(lectureId: string) {
    const { error } = await tryCatch(
      deleteLecture.mutateAsync({ courseId, lectureId }),
    );

    if (!error) {
      deleteLectureItem(lectureId);
      reOrderCurriculumItems();
      syncCurriculumOrder();
    }
  }

  function handleEditChapter(chapter: Chapter, index: number) {
    setSelectedChapter(chapter);
    setSelectedIndex(index);
    setOpenChapterFormModal({
      mode: "edit",
      isOpen: true,
    });
  }

  async function handleDeleteChapter(chapterId: string) {
    const { error } = await tryCatch(
      deleteChapter.mutateAsync({ courseId, chapterId }),
    );

    if (!error) {
      deleteChapterItem(chapterId);
      reOrderCurriculumItems();
      syncCurriculumOrder();
    }
  }

  function onContentUploadSuccessHandler(
    key: string,
    resourceType: "image" | "video",
    uuid: string,
  ) {
    if (selectedLecture) {
      addContentToLecture.mutate({
        courseId,
        lectureId: selectedLecture.id,
        key,
        uuid,
        fileName: "null",
        resourceType,
      });
    }
  }

  function handleLectureContentUpload(lecture: Lecture) {
    setOpenFileUploadModal(true);
    setSelectedLecture(lecture);
  }

  return (
    <>
      <div>
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <SortableContext
            items={curriculumItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="w-full">
              {curriculumItems.map((item, i) => {
                const isLastItem = i === curriculumItems.length - 1;
                const nextItemIsChapter =
                  !isLastItem && curriculumItems[i + 1]?._class === "chapter";
                const isChapter = item._class === "chapter";
                // Check if the current item is the last lecture in a chapter
                const isLastItemInChapter =
                  !isChapter && (nextItemIsChapter || isLastItem);

                return (
                  <React.Fragment key={item.id}>
                    {/* <div className="py-2">
                    <Button
                    color="secondary"
                    size="sm"
                    onPress={() =>
                    isChapter
                    ? setOpenCreateSectionModal(true)
                    : setOpenCreateLectureModal(true)
                    }
                    >
                    {isChapter ? "Add Section" : "Add Lecture"}
                    </Button>
                    </div> */}

                    <SortableItem id={item.id}>
                      <Card
                        className={` ${
                          i !== 0 && isChapter ? "mt-4" : ""
                        } ${isChapter ? "rounded-t-lg rounded-b-none" : "rounded-none"} ${
                          isLastItemInChapter ? "rounded-b-lg" : ""
                        }`}
                        shadow="none"
                      >
                        <div className="flex items-center group">
                          <div className="flex-1">
                            {isChapter ? (
                              <SortableChapterItem
                                chapter={item}
                                index={i}
                                isFirstItem={i === 0}
                                onDelete={handleDeleteChapter}
                                onEdit={handleEditChapter}
                              />
                            ) : (
                              <SortableLectureItem
                                index={i}
                                isLastItemInChapter={isLastItemInChapter}
                                lecture={item}
                                onAddContent={handleLectureContentUpload}
                                onAddLecture={handleCreateLecture}
                                onDelete={handleDeleteLecture}
                                onEdit={handleEditLecture}
                              />
                            )}
                          </div>
                        </div>
                      </Card>
                    </SortableItem>
                  </React.Fragment>
                );
              })}

              <div className="pt-4">
                <Button
                  color="primary"
                  size="sm"
                  onPress={() => {
                    setOpenChapterFormModal({ mode: "create", isOpen: true });
                    setSelectedIndex(curriculumItems.length);
                  }}
                >
                  Add Chapter
                </Button>
              </div>
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId && activeItem ? (
              <Card shadow="md">
                <CardBody>
                  <p>
                    <span className="font-semibold capitalize">
                      {activeItem._class} {activeItem.objectIndex}:
                    </span>{" "}
                    {activeItem.title}
                  </p>
                </CardBody>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <FormModal
        form={
          <LectureForm
            initialValue={selectedLecture ? selectedLecture : undefined}
            isPending={
              openLectureFormModal.mode === "create"
                ? createLecture.isPending
                : updateLecture.isPending
            }
            mode={openLectureFormModal.mode}
            previewContent={
              selectedLecture && selectedLecture.asset ? true : false
            }
            previewContentSrc={
              selectedLecture && selectedLecture.asset
                ? {
                    type: selectedLecture.asset.mediaSources[0].type,
                    src: selectedLecture.asset.mediaSources[0].src,
                  }
                : null
            }
            showFileUploader={
              selectedLecture && selectedLecture.assetId ? true : false
            }
            onCancel={() => {
              setOpenLectureFormModal({
                ...openLectureFormModal,
                isOpen: false,
              });
              setSelectedLecture(null);
            }}
            onContentUploadHander={onContentUploadSuccessHandler}
            onSubmitHandler={lectureOnSubmitHandler}
          />
        }
        isOpen={openLectureFormModal.isOpen}
        title={`${openLectureFormModal.mode === "edit" ? "Update" : "Create"} lecture`}
        onClose={() => {
          setOpenLectureFormModal({ ...openLectureFormModal, isOpen: false });
          setSelectedLecture(null);
        }}
      />

      <FormModal
        form={
          <ChapterForm
            initialValue={selectedChapter ? selectedChapter : undefined}
            isPending={
              openChapterFormModal.mode === "create"
                ? createChapter.isPending
                : createChapter.isPending
            }
            mode={openChapterFormModal.mode}
            onCancel={() => {
              setOpenChapterFormModal({
                ...openChapterFormModal,
                isOpen: false,
              });
            }}
            onSubmitHandler={chapterFormSubmitHandler}
          />
        }
        isOpen={openChapterFormModal.isOpen}
        title={`${openChapterFormModal.mode === "edit" ? "Update" : "Create"} chapter`}
        onClose={() =>
          setOpenChapterFormModal({ ...openChapterFormModal, isOpen: false })
        }
      />

      <FileUploadModal
        isOpen={openFileUploadModal}
        onClose={() => {
          setOpenFileUploadModal(false);
        }}
        onSuccess={onContentUploadSuccessHandler}
      />
    </>
  );
}
