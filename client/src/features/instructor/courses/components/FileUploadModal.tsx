import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";

import FileUploader from "@/components/FileUploader";

export default function FileUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (
    key: string,
    resourceType: "image" | "video",
    uuid: string,
  ) => void;
}) {
  return (
    <Modal
      backdrop="blur"
      classNames={{
        backdrop: "bg-background/80 backdrop-opacity-50",
      }}
      isOpen={isOpen}
      placement="top-center"
      scrollBehavior="inside"
      onClose={onClose}
      onOpenChange={() => onClose()}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Upload your video</ModalHeader>
            <ModalBody>
              <FileUploader
                acceptedFileType="video"
                maxFiles={1}
                maxSize={1024 * 1024 * 1024}
                value={null}
                onSuccess={onSuccess}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
