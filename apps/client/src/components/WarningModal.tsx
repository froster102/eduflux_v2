import { Modal, ModalBody, ModalContent } from "@heroui/modal";
import { Alert } from "@heroui/alert";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

export default function WarningModal({ isOpen }: { isOpen: boolean }) {
  return (
    <Modal
      backdrop="blur"
      classNames={{
        base: "bg-secondary",
      }}
      hideCloseButton={true}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
    >
      <ModalContent>
        {() => (
          <ModalBody className="p-6">
            <Alert color={"danger"} title={`This is a warning alert`} />
            <p>
              This message is to inform you that your account has been
              blocked,Please contact the administratives for your account
              activation!
            </p>
            <Button
              as={Link}
              className="bg-zinc-800 text-zinc-100"
              href="/auth/sign-in"
            >
              Back to sign in
            </Button>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
