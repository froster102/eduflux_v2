import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";

export default function CourseErrorModal({
  isOpen,
  onClose,
  error,
}: {
  error: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const parsedErrors = error && (JSON.parse(error) as string[]);

  return (
    <Modal
      backdrop="blur"
      className="dark:bg-secondary-700 bg-secondary-400"
      classNames={{
        backdrop: "bg-secondary-600/10",
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
            <ModalHeader className="px-4 pb-0">
              Why can&apos;t I submit the course
            </ModalHeader>
            <ModalBody className="p-2">
              <div className="px-6">
                <ul className="list-disc">
                  {parsedErrors &&
                    parsedErrors.map((error, i) => <li key={i}>{error}</li>)}
                </ul>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
