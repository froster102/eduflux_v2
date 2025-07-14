import { Card, CardBody } from "@heroui/card";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import React from "react";

import PlayIcon from "@/assets/icons/PlayIcon";
import HLSPlayer from "@/components/HLSPlayer";

interface PreviewLectureModalProps {
  lectures: Lecture[];
  isOpen: boolean;
  selectedLecture?: Lecture | null;
  onClose: () => void;
}

export default function PreviewLectureModal({
  isOpen,
  selectedLecture,
  onClose,
  lectures,
}: PreviewLectureModalProps) {
  const [activePreviewLecture, setActivePreviewLecture] =
    React.useState<Lecture | null>(
      selectedLecture ? selectedLecture : lectures[0],
    );

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="top-center"
      scrollBehavior="inside"
      onClose={onClose}
      onOpenChange={() => onClose()}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <p>Course preview</p>
            </ModalHeader>
            <ModalBody>
              {activePreviewLecture && (
                <Card>
                  <HLSPlayer
                    options={{
                      sources: activePreviewLecture.asset?.mediaSources!,
                      autoplay: true,
                      controls: true,
                      responsive: true,
                    }}
                  />
                </Card>
              )}
              {lectures.map((lecture) => (
                <Card
                  key={lecture.id}
                  isPressable
                  className=" bg-background"
                  shadow="sm"
                  onPress={() => setActivePreviewLecture(lecture)}
                >
                  <CardBody>
                    <div className="flex items-center gap-3">
                      <PlayIcon className="flex-shrink-0" width={14} />
                      <p className="flex-grow">{lecture.title}</p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
