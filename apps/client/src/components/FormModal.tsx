import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";

interface FormModalProps {
  form: React.ReactNode;
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  size?:
    | "full"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl";
  submitText?: string;
  cancelText?: string;
}

export default function FormModal({
  isOpen,
  onClose,
  size,
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
      size={size}
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
