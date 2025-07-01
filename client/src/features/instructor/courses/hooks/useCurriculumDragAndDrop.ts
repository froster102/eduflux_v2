import React from "react";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import { useUpdateCurriculumItems } from "./mutations";

export const useCurriculumDragAndDrop = (
  initialsItems: CurriculumItems,
  courseId: string,
) => {
  const [curriculumItems, setCurriculumItems] = React.useState(initialsItems);
  const updateCurriculumItems = useUpdateCurriculumItems();
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const reArrangeCurriculumItems = React.useCallback(
    (
      currentItems: CurriculumItem[],
      activeItemId: string,
      overItemId?: string,
    ) => {
      const activeIndex = currentItems.findIndex(
        (item) => item.id === activeItemId,
      );
      const overIndex = currentItems.findIndex(
        (item) => item.id === overItemId,
      );

      if (activeIndex === -1 || overIndex === -1) {
        return currentItems;
      }

      const newItems = [...currentItems];
      const movedItem = newItems[activeIndex];

      let itemsToMove: CurriculumItem[] = [];
      let itemsToRemoveCount = 0;

      if (movedItem._class === "chapter") {
        itemsToMove.push(movedItem);
        itemsToRemoveCount++;

        for (let i = activeIndex + 1; i < newItems.length; i++) {
          if (newItems[i]._class === "chapter") {
            break;
          }
          itemsToMove.push(newItems[i]);
          itemsToRemoveCount++;
        }
      } else {
        itemsToMove.push(movedItem);
        itemsToRemoveCount = 1;
      }

      newItems.splice(activeIndex, itemsToRemoveCount);

      newItems.splice(overIndex, 0, ...itemsToMove);

      return newItems;
    },
    [],
  );

  const reOrderCurriculumItems = React.useCallback((items: CurriculumItems) => {
    const newItems = [...items];

    let currentChapterIndex = 1;
    let currentLectureIndex = 1;

    for (let i = 0; i < newItems.length; i++) {
      if (newItems[i]._class === "chapter") {
        newItems[i] = {
          ...newItems[i],
          objectIndex: currentChapterIndex++,
        };
      }
      if (newItems[i]._class === "lecture") {
        newItems[i] = {
          ...newItems[i],
          objectIndex: currentLectureIndex++,
        };
      }
    }

    return newItems;
  }, []);

  const activeItem = curriculumItems.find((item) => item.id === activeId);

  const insertCurriculumItem = React.useCallback(
    (
      currentItems: CurriculumItems,
      newItem: CurriculumItem,
      position: number,
    ) => {
      const newItems = [...currentItems];

      newItems.splice(position + 1, 0, newItem);

      const reOrderedItems = reOrderCurriculumItems(newItems);

      return reOrderedItems;
    },
    [],
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);

    if (active.id !== over?.id) {
      const reArrangedItems = reArrangeCurriculumItems(
        curriculumItems,
        active.id.toString(),
        over?.id.toString(),
      );
      const reOrderedItems = reOrderCurriculumItems(reArrangedItems);

      setCurriculumItems(reOrderedItems);

      updateCurriculumItems.mutate({
        courseId,
        items: reOrderedItems.map((item) => ({
          id: item.id,
          class: item._class,
        })),
      });
    }
  }

  return {
    handleDragEnd,
    handleDragStart,
    reArrangeCurriculumItems,
    reOrderCurriculumItems,
    insertCurriculumItem,
    activeItem,
    curriculumItems,
    setCurriculumItems,
    activeId,
  };
};
