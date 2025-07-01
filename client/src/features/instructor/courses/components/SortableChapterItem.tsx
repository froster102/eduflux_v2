import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";

import SortableItem from "./SortableItem";

import EditIcon from "@/assets/icons/EditIcon";
import DeleteIcon from "@/assets/icons/DeleteIcon";
import DragIcon from "@/assets/icons/DragIcon";

interface SortableSectionItemProps {
  chapter: CurriculumItem;
  isFirstItem: boolean;
  index: number;
  onEdit: (chapter: Chapter, index: number) => void;
  onDelete: (id: string) => void;
}

export default function SortableChapterItem({
  isFirstItem,
  chapter,
  onDelete,
  index,
  onEdit,
}: SortableSectionItemProps) {
  return (
    <>
      <SortableItem id={chapter.id}>
        <Card
          className={`bg-secondary-600 ${
            isFirstItem ? "mt-4" : ""
          } rounded-t-lg rounded-b-none"
        }`}
          shadow="none"
        >
          <div className="flex items-center group">
            <div className="flex-1">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p>
                      <span className="font-semibold">
                        Chapter {chapter.objectIndex}:
                      </span>{" "}
                      {chapter.title}
                    </p>
                    <div className="flex items-center opacity-0 invisible transition-opacity duration-300 ease-in-out group-hover:opacity-100 group-hover:visible">
                      <Button
                        isIconOnly
                        className="p-0 bg-transparent"
                        size="sm"
                        onPress={() => {
                          if (chapter._class === "chapter") {
                            onEdit(chapter, index);
                          }
                        }}
                      >
                        <EditIcon width={12} />
                      </Button>
                      <Button
                        isIconOnly
                        className="p-0 bg-transparent"
                        size="sm"
                        onPress={() => {
                          onDelete(chapter.id);
                        }}
                      >
                        <DeleteIcon width={14} />
                      </Button>
                    </div>
                  </div>
                  <div className="px-2 opacity-0 invisible  transition-opacity duration-300 ease-in-out group-hover:opacity-100 group-hover:visible">
                    <DragIcon width={24} />
                  </div>
                </div>
              </CardBody>
            </div>
          </div>
        </Card>
      </SortableItem>
    </>
  );
}
