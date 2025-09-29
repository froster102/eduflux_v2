import { Calendar, DateValue } from "@heroui/calendar";
import { Avatar } from "@heroui/avatar";
import { Tab, Tabs } from "@heroui/tabs";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { parseAbsoluteToLocal, parseDateTime } from "@internationalized/date";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";

import { IMAGE_BASE_URL } from "@/config/image";
import ClockIcon from "@/components/icons/ClockIcon";
import VideoIcon from "@/components/icons/VideoIcon";

interface SessionSchedulerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  instructor: Instructor;
  availableSlots: AvailableSlots[];
  isSlotsLoading: boolean;
  onSlotSelectionChange: (slot: AvailableSlots) => void;
  selectedSlot: AvailableSlots | null;
  selectedDate: string;
  onSelectedDateChange: (date: string) => void;
  onConfirmBooking: (data: { slotId: string }) => void;
  isConfirmBookingPending: boolean;
}

export default function SessionScheduler({
  isOpen,
  onOpenChange,
  instructor,
  availableSlots,
  isSlotsLoading,
  onSlotSelectionChange,
  selectedSlot,
  selectedDate,
  onSelectedDateChange,
  onConfirmBooking,
  isConfirmBookingPending,
}: SessionSchedulerProps) {
  return (
    <Modal
      backdrop="blur"
      classNames={{
        backdrop: "bg-background/80 backdrop-opacity-50",
      }}
      isOpen={isOpen}
      size="5xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <p>Select Date and Time</p>
              <small className="text-default-500">
                Choose your appointment date and time from the calender
              </small>
            </ModalHeader>
            <ModalBody className="flex flex-row justify-center">
              <div className="flex w-[393px] flex-col items-center gap-5 rounded-large lg:w-fit lg:flex-row lg:items-start lg:px-6">
                <div className="flex flex-col gap-2 p-6 lg:w-[220px] lg:px-4 lg:pt-8">
                  <div>
                    <Avatar
                      src={`${IMAGE_BASE_URL}${instructor.profile.image}`}
                    />
                    <small className="text-default-500">
                      {instructor.profile.name}
                    </small>
                    <p className="font-medium">Video call</p>
                  </div>
                  <p className="text-sm line-clamp-5">
                    {instructor.profile.bio}
                  </p>
                  <div className="flex flex-col">
                    <p className="inline-flex text-xs items-center text-default-700 gap-1">
                      <ClockIcon width={16} />
                      15m
                    </p>
                    <p className="inline-flex text-xs items-center text-default-700 gap-1">
                      <VideoIcon width={16} />
                      App
                    </p>
                  </div>
                </div>
                <div>
                  <Calendar
                    aria-label="Booking Calender"
                    calendarWidth={372}
                    className="overflow-hidden"
                    classNames={{
                      base: "!bg-transparent border-0 shadow-none",
                      cell: "p-1.5 w-full",
                      gridBodyRow:
                        "!gap-x-1 !px-3 !mb-1 !first:mt-4 !last:mb-0",
                      gridHeader: "!bg-transparent !shadow-none",
                      gridHeaderCell: "!text-default-400 !text-xs !p-0 !w-full",
                      gridHeaderRow: "px-3 pb-3",
                      gridWrapper: "pb-2",
                      headerWrapper: "!bg-transparent",
                      title: "font-semibold text-white",
                    }}
                    showShadow={false}
                    value={parseDateTime(selectedDate) as any}
                    weekdayStyle="short"
                    onChange={(date: DateValue) => {
                      onSelectedDateChange(date.toString());
                    }}
                  />
                </div>
                <div className="flex w-full flex-col items-center gap-2 px-6 pb-6 lg:w-[220px] lg:p-0">
                  <div className="flex justify-between items-center w-full">
                    <p>Fri 25</p>
                    <Tabs aria-label="Options" color="primary" size="sm">
                      <Tab key="photos" title="12h" />
                      <Tab key="music" title="24h" />
                    </Tabs>
                  </div>
                  <ScrollShadow className="h-[280px] overflow-y-scroll scrollbar-hide w-full">
                    {isSlotsLoading ? (
                      <div className="flex justify-center h-full items-center">
                        <Spinner />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {availableSlots.map((slot) => {
                          const parsedStartTime = parseAbsoluteToLocal(
                            slot.startTime,
                          );
                          const parsedEndTime = parseAbsoluteToLocal(
                            slot.endTime,
                          );
                          const startTime = `${parsedStartTime.hour < 10 ? `0${parsedStartTime.hour}` : parsedStartTime.hour}:${parsedStartTime.minute < 10 ? `0${parsedStartTime.minute}` : parsedStartTime.minute}`;
                          const endTime = `${parsedEndTime.hour < 10 ? `0${parsedEndTime.hour}` : parsedEndTime.hour}:${parsedEndTime.minute < 10 ? `0${parsedEndTime.minute}` : parsedEndTime.minute}`;

                          return (
                            <div key={slot.id}>
                              <div className="relative flex w-full justify-end gap-4">
                                <div
                                  className={`absolute left-0 transition-all duration-300 ease-in-out ${
                                    selectedSlot && selectedSlot.id === slot.id
                                      ? "w-[55%]"
                                      : "w-full"
                                  }`}
                                >
                                  <Button
                                    fullWidth
                                    className="font-medium bg-background border border-default-200"
                                    onPress={() => onSlotSelectionChange(slot)}
                                  >
                                    {startTime} - {endTime}
                                  </Button>
                                </div>
                                <div
                                  className={`transition-all duration-300 ease-in-out ${
                                    selectedSlot && selectedSlot.id === slot.id
                                      ? "w-[40%] opacity-100"
                                      : "w-0 opacity-0"
                                  } overflow-hidden`}
                                >
                                  <Button
                                    fullWidth
                                    color="primary"
                                    isDisabled={isConfirmBookingPending}
                                    isLoading={isConfirmBookingPending}
                                    onPress={() =>
                                      onConfirmBooking({ slotId: slot.id })
                                    }
                                  >
                                    Confirm
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollShadow>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
