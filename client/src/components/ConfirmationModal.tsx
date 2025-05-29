import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  boldText?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onConfirm,
  onClose,
  title = "Confirm your action",
  boldText = "",
  message = "Are you sure to continue with your action",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading,
}: ConfirmationModalProps) {
  return (
    <Modal
      backdrop="blur"
      classNames={{
        base: `dark:bg-secondary-600 bg-secondary-500`,
        backdrop: "dark:bg-secondary-600/10",
      }}
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex  flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <p>
                {message} <strong>{boldText}</strong>
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {cancelText}
              </Button>
              <Button color="primary" isLoading={loading} onPress={onConfirm}>
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
