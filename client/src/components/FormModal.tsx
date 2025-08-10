import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";

interface FormModalProps {
  form: React.ReactNode;
  isOpen: boolean;
  title?: string;
  onClose: () => void;
}

export default function FormModal({
  isOpen,
  onClose,
  title = "Please complete the form to continue.",
  form,
}: FormModalProps) {
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
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>{form}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
