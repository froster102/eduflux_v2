import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { addToast } from '@heroui/toast';

import { useCurriculumStore } from '@/store/curriculum-store';
import FormModal from '@/components/FormModal';
import { tryCatch } from '@/utils/try-catch';

import { useCreateLecture } from '../hooks/useCreateLecture';
import { useUpdateLecture } from '../hooks/useUpdateLecture';
import { useDeleteLecture } from '../hooks/useDeleteLecture';
import { useCreateChapter } from '../hooks/useCreateChapter';
import { useUpdateChapter } from '../hooks/useUpdateChapter';
import { useDeleteChapter } from '../hooks/useDeleteChapter';
import { useAddContentToLecture } from '../hooks/useAddContentToLecture';
import { useUpdateCurriculumItems } from '../hooks/useUpdateCurriculumItems';

import SortableItem from './SortableItem';
import SortableChapterItem from './SortableChapterItem';
import SortableLectureItem from './SortableLectureItem';
import LectureForm from './forms/LectureForm';
import ChapterForm from './forms/ChapterForm';
import FileUploadModal from './FileUploadModal';

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
  const updateCurriculumItems = useUpdateCurriculumItems();

  React.useEffect(() => {
    if (initialCurriculumItems) {
      setCurriculumItems(initialCurriculumItems);
    }
  }, [initialCurriculumItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
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

    if (!over || active.id === over.id) return;

    const activeItem = curriculumItems.find((i) => i.id === active.id);
    const overItem = curriculumItems.find((i) => i.id === over.id);

    if (activeItem?._class === 'lecture' && overItem?._class === 'chapter') {
      const firstChapter = curriculumItems.find((i) => i._class === 'chapter');

      if (overItem.id === firstChapter?.id) {
        addToast({
          description: 'Cannot move lecture before the first chapter',
          color: 'warning',
        });

        return;
      }
    }

    reArrangeCurriculumItems(active.id.toString(), over.id.toString());
    reOrderCurriculumItems();
    syncCurriculumOrder();
  }

  async function lectureOnSubmitHandler(data: LectureFormData) {
    if (openLectureFormModal.mode === 'create') {
      const { data: newLecture } = await tryCatch(
        createLecture.mutateAsync({ ...data, courseId }),
      );

      if (newLecture && selectedIndex !== undefined) {
        insertCurriculumItem(newLecture.data, selectedIndex);
        reOrderCurriculumItems();
        syncCurriculumOrder();
      }
    } else if (openLectureFormModal.mode === 'edit') {
      if (selectedLecture && selectedIndex !== undefined) {
        const { error } = await tryCatch(
          updateLecture.mutateAsync({
            ...data,
            lectureId: selectedLecture.id,
            courseId,
          }),
        );

        if (!error) {
          updateLectureItem({ ...selectedLecture, ...data }, selectedIndex);
        }
      }
    }
    setOpenLectureFormModal({ ...openLectureFormModal, isOpen: false });
  }

  async function chapterFormSubmitHandler(data: ChapterFormData) {
    if (openChapterFormModal.mode === 'create') {
      const { data: response } = await tryCatch(
        createChapter.mutateAsync({ ...data, courseId }),
      );

      if (response && selectedIndex !== undefined) {
        insertCurriculumItem(response.data, selectedIndex);
        reOrderCurriculumItems();
        syncCurriculumOrder();
      }
    } else if (openChapterFormModal.mode === 'edit') {
      if (selectedChapter && selectedIndex !== undefined) {
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

  function handleCreateLecture(selectedIndex: number) {
    setSelectedIndex(selectedIndex);
    setOpenLectureFormModal({ mode: 'create', isOpen: true });
  }

  function handleEditLecture(lecture: Lecture, index: number) {
    setSelectedLecture(lecture);
    setSelectedIndex(index);
    setOpenLectureFormModal({ mode: 'edit', isOpen: true });
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
    setOpenChapterFormModal({ mode: 'edit', isOpen: true });
  }

  function getInsertIndexAfterLastLecture(
    chapterId: string,
    items: CurriculumItem[],
  ) {
    const chapterIndex = items.findIndex((i) => i.id === chapterId);

    if (chapterIndex === -1) return items.length;

    const nextChapterIndex = items
      .slice(chapterIndex + 1)
      .findIndex((i) => i._class === 'chapter');

    if (nextChapterIndex === -1) {
      return items.length;
    }

    return chapterIndex + 1 + nextChapterIndex;
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

  function handleLectureContentUpload(lecture: Lecture) {
    setOpenFileUploadModal(true);
    setSelectedLecture(lecture);
  }

  function onContentUploadSuccessHandler(
    key: string,
    resourceType: 'image' | 'video',
    uuid: string,
  ) {
    if (selectedLecture) {
      addContentToLecture.mutate({
        courseId,
        lectureId: selectedLecture.id,
        key,
        uuid,
        fileName: 'null',
        resourceType,
      });
    }
  }

  const groupedItems = React.useMemo(() => {
    const groups: { chapter: Chapter; lectures: Lecture[] }[] = [];
    let currentChapter: Chapter | null = null;

    for (const item of curriculumItems) {
      if (item._class === 'chapter') {
        currentChapter = item as Chapter;
        groups.push({ chapter: currentChapter, lectures: [] });
      } else if (currentChapter) {
        groups[groups.length - 1].lectures.push(item as Lecture);
      }
    }

    return groups;
  }, [curriculumItems]);

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
              {groupedItems.map(({ chapter, lectures }) => (
                <React.Fragment key={chapter.id}>
                  {/* Chapter */}
                  <SortableItem id={chapter.id}>
                    <Card
                      className="mt-4 rounded-t-lg rounded-b-none"
                      shadow="none"
                    >
                      <SortableChapterItem
                        chapter={chapter}
                        index={curriculumItems.indexOf(chapter)}
                        isFirstItem={false}
                        onDelete={handleDeleteChapter}
                        onEdit={handleEditChapter}
                      />
                    </Card>
                  </SortableItem>

                  {lectures.map((lecture, i) => (
                    <SortableItem key={lecture.id} id={lecture.id}>
                      <Card
                        className={`rounded-none ${
                          i === lectures.length - 1 ? 'rounded-b-lg' : ''
                        }`}
                        shadow="none"
                      >
                        <SortableLectureItem
                          index={curriculumItems.indexOf(lecture)}
                          lecture={lecture}
                          onAddContent={handleLectureContentUpload}
                          onDelete={handleDeleteLecture}
                          onEdit={handleEditLecture}
                        />
                      </Card>
                    </SortableItem>
                  ))}

                  <div className="pl-12 py-3">
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => {
                        const index = getInsertIndexAfterLastLecture(
                          chapter.id,
                          curriculumItems,
                        );

                        handleCreateLecture(index);
                      }}
                    >
                      Add Lecture
                    </Button>
                  </div>
                </React.Fragment>
              ))}

              {/* Add new chapter */}
              <div className="pt-4">
                <Button
                  color="primary"
                  size="sm"
                  onPress={() => {
                    setOpenChapterFormModal({ mode: 'create', isOpen: true });
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
                    </span>{' '}
                    {activeItem.title}
                  </p>
                </CardBody>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Lecture Form Modal */}
      <FormModal
        form={
          <LectureForm
            initialValue={selectedLecture ?? undefined}
            isPending={
              openLectureFormModal.mode === 'create'
                ? createLecture.isPending
                : updateLecture.isPending
            }
            mode={openLectureFormModal.mode}
            previewContent={!!(selectedLecture && selectedLecture.asset)}
            previewContentSrc={
              selectedLecture?.asset
                ? {
                    type: selectedLecture.asset.mediaSources[0].type,
                    src: selectedLecture.asset.mediaSources[0].src,
                  }
                : null
            }
            showFileUploader={!!selectedLecture?.assetId}
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
        title={`${openLectureFormModal.mode === 'edit' ? 'Update' : 'Create'} lecture`}
        onClose={() => {
          setOpenLectureFormModal({ ...openLectureFormModal, isOpen: false });
          setSelectedLecture(null);
        }}
      />

      {/* Chapter Form Modal */}
      <FormModal
        form={
          <ChapterForm
            initialValue={selectedChapter ?? undefined}
            isPending={createChapter.isPending}
            mode={openChapterFormModal.mode}
            onCancel={() =>
              setOpenChapterFormModal({
                ...openChapterFormModal,
                isOpen: false,
              })
            }
            onSubmitHandler={chapterFormSubmitHandler}
          />
        }
        isOpen={openChapterFormModal.isOpen}
        title={`${openChapterFormModal.mode === 'edit' ? 'Update' : 'Create'} chapter`}
        onClose={() =>
          setOpenChapterFormModal({ ...openChapterFormModal, isOpen: false })
        }
      />

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={openFileUploadModal}
        onClose={() => setOpenFileUploadModal(false)}
        onSuccess={onContentUploadSuccessHandler}
      />
    </>
  );
}
