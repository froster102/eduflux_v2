import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";

import CheckIcon from "@/assets/icons/CheckIcon";
import CrossIcon from "@/assets/icons/CrossIcon";

interface BookingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (isOpen: boolean) => void;
  bookingStatus: {
    success?: boolean;
    instructor?: string;
    user?: string;
    startTime?: string;
    endTime?: string;
  };
}

export default function BookingStatusModal({
  isOpen,
  onClose,
  bookingStatus,
}: BookingStatusModalProps) {
  const { success, instructor, user } = bookingStatus;

  function renderBasedOnBookingStatus(status: boolean) {
    if (status) {
      return (
        <>
          <ModalHeader className="flex flex-col w-full px-8 items-center">
            <CheckIcon className="text-green-400" height={56} width={56} />
            <p className="text-base font-medium mb-2 text-center">
              Your session has been scheduled
            </p>
            <p className="text-center text-small font-medium text-default-500">
              We have sent an email with the details to the both participants.
            </p>
          </ModalHeader>
          <Divider />
          <ModalBody className="flex w-full flex-col items-center gap-4 px-8">
            <div className="flex w-full flex-col gap-1">
              <p>Details</p>
              <small>
                60 min session between {instructor} and {user}
              </small>
            </div>
            <div className="flex w-full flex-col gap-1">
              <p>When</p>
              <small>
                Friday, December 27, 2024 6:30 PM - 7:00 PM (Argentina Standard
                Time)
              </small>
            </div>
            <div className="flex w-full flex-col gap-1">
              <p>Invited</p>
              <small>
                {instructor}{" "}
                <span>
                  <Chip
                    className="text-[10px] text-primary/50  bg-primary/20 h-4"
                    size="sm"
                    variant="flat"
                  >
                    Host
                  </Chip>
                </span>
              </small>
              <small>{user}</small>
            </div>
            <div className="flex w-full flex-col gap-1">
              <p>Where</p>
              <small>In App</small>
            </div>
          </ModalBody>
        </>
      );
    }

    return (
      <>
        <ModalHeader className="flex flex-col w-full px-8 items-center">
          <CrossIcon className="text-red-400" height={56} width={56} />

          <p className="text-base font-medium mb-2 text-center">
            Your session schedule has been cancelled
          </p>
          <p className="text-center text-small font-medium text-default-500">
            We have sent an email with the details to the both participants.
          </p>
        </ModalHeader>
      </>
    );
  }

  return (
    <Modal
      backdrop="blur"
      className="flex flex-col gap-5 w-[375px]"
      classNames={{
        backdrop: "bg-background/80 backdrop-opacity-50",
      }}
      hideCloseButton={true}
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onClose}
    >
      <ModalContent>
        {() => <>{renderBasedOnBookingStatus(success!)}</>}
      </ModalContent>
    </Modal>
  );
}
