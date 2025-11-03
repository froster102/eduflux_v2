import { Modal, ModalBody, ModalHeader, ModalContent } from '@heroui/modal';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  errors: string[];
}
export default function ErrorModal({
  isOpen,
  onClose,
  title,
  errors,
}: ErrorModalProps) {
  return (
    <Modal
      backdrop="blur"
      classNames={{
        backdrop: 'bg-background/80 backdrop-opacity-50',
      }}
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onClose}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex  flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <ul>
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
