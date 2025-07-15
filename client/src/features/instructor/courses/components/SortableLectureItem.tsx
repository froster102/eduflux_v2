import { Button } from "@heroui/button";
import { CardBody } from "@heroui/card";

import AddIcon from "@/assets/icons/AddIcon";
import DragIcon from "@/assets/icons/DragIcon";
import EditIcon from "@/assets/icons/EditIcon";
import DeleteIcon from "@/assets/icons/DeleteIcon";

interface SortableLectureItemProps {
  lecture: CurriculumItem;
  isLastItemInChapter: boolean;
  index: number;
  onEdit: (lecture: Lecture, index: number) => void;
  onDelete: (id: string) => void;
  onAddLecture: (index: number) => void;
  onAddContent: (lecture: Lecture) => void;
}

export default function SortableLectureItem({
  lecture,
  onDelete,
  onEdit,
  onAddLecture,
  onAddContent,
  index,
  isLastItemInChapter,
}: SortableLectureItemProps) {
  return (
    <>
      <div className="pl-12 pr-2 group">
        <CardBody className="border border-default-200 rounded-lg">
          <div className="flex justify-between">
            <div className="flex items-center justify-between">
              <div className="px-2 opacity-0 invisible  transition-opacity duration-300 ease-in-out group-hover:opacity-100 group-hover:visible">
                <DragIcon width={24} />
              </div>
              <p>
                <span className="font-semibold capitalize">
                  {lecture._class} {lecture.objectIndex}:
                </span>{" "}
                {lecture.title}
              </p>
              <div className="flex items-center opacity-0 invisible transition-opacity duration-300 ease-in-out group-hover:opacity-100 group-hover:visible">
                <Button
                  isIconOnly
                  className="p-0 bg-transparent"
                  size="sm"
                  onPress={() => {
                    if (lecture._class === "lecture") {
                      onEdit(lecture, index);
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
                    onDelete(lecture.id);
                  }}
                >
                  <DeleteIcon width={14} />
                </Button>
              </div>
            </div>
            <div className="flex items-center">
              {!lecture.assetId && (
                <Button
                  size="sm"
                  startContent={<AddIcon width={12} />}
                  onPress={() => {
                    if (lecture._class === "lecture") {
                      onAddContent(lecture);
                    }
                  }}
                >
                  Content
                </Button>
              )}
            </div>
          </div>
        </CardBody>
        <div className="py-2">
          {isLastItemInChapter && (
            <Button
              color="primary"
              size="sm"
              onPress={() => {
                onAddLecture(index);
              }}
            >
              Curriculum item
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
