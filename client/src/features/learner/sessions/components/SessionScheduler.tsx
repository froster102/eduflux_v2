import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@heroui/drawer";
import { Calendar, DateValue } from "@heroui/calendar";
import { Avatar } from "@heroui/avatar";
import { Tab, Tabs } from "@heroui/tabs";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { parseAbsoluteToLocal, parseDateTime } from "@internationalized/date";

import { IMAGE_BASE_URL } from "@/config/image";
import ClockIcon from "@/assets/icons/ClockIcon";
import VideoIcon from "@/assets/icons/VideoIcon";

interface SessionSchedulerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  instructorProfile: InstructorProfile;
  availableSlots: AvailableSlots[];
  isSlotsLoading: boolean;
  onSlotSelectionChange: (slot: AvailableSlots) => void;
  selectedSlot: AvailableSlots | null;
  selectedDate: string;
  onSelectedDateChange: (date: string) => void;
  onConfirmBooking: (data: { slotId: string }) => void;
  isConfirmBookingPending: boolean;
}

export const Content = () => (
  <div>
    <p>
      Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco
      deserunt aute id consequat veniam incididunt duis in sint irure nisi.
      Mollit officia cillum Lorem ullamco minim nostrud elit officia tempor esse
      quis.
    </p>
    <p>
      Sunt ad dolore quis aute consequat. Magna exercitation reprehenderit magna
      aute tempor cupidatat consequat elit dolor adipisicing. Mollit dolor
      eiusmod sunt ex incididunt cillum quis. Velit duis sit officia eiusmod
      Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi
      consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
      deserunt nostrud ad veniam.
    </p>
    <p>
      Est velit labore esse esse cupidatat. Velit id elit consequat minim.
      Mollit enim excepteur ea laboris adipisicing aliqua proident occaecat do
      do adipisicing adipisicing ut fugiat. Consequat pariatur ullamco aute sunt
      esse. Irure excepteur eu non eiusmod. Commodo commodo et ad ipsum elit
      esse pariatur sit adipisicing sunt excepteur enim.
    </p>
    <p>
      Incididunt duis commodo mollit esse veniam non exercitation dolore
      occaecat ea nostrud laboris. Adipisicing occaecat fugiat fugiat irure
      fugiat in magna non consectetur proident fugiat. Commodo magna et aliqua
      elit sint cupidatat. Sint aute ullamco enim cillum anim ex. Est eiusmod
      commodo occaecat consequat laboris est do duis. Enim incididunt non culpa
      velit quis aute in elit magna ullamco in consequat ex proident.
    </p>
    <p>
      Dolore incididunt mollit fugiat pariatur cupidatat ipsum laborum cillum.
      Commodo consequat velit cupidatat duis ex nisi non aliquip ad ea pariatur
      do culpa. Eiusmod proident adipisicing tempor tempor qui pariatur
      voluptate dolor do ea commodo. Veniam voluptate cupidatat ex nisi do
      ullamco in quis elit.
    </p>
    <p>
      Cillum proident veniam cupidatat pariatur laborum tempor cupidatat anim
      eiusmod id nostrud pariatur tempor reprehenderit. Do esse ullamco laboris
      sunt proident est ea exercitation cupidatat. Do Lorem eiusmod aliqua culpa
      ullamco consectetur veniam voluptate cillum. Dolor consequat cillum tempor
      laboris mollit laborum reprehenderit reprehenderit veniam aliqua deserunt
      cupidatat consequat id.
    </p>
    <p>
      Est id tempor excepteur enim labore sint aliquip consequat duis minim
      tempor proident. Dolor incididunt aliquip minim elit ea. Exercitation non
      officia eu id.
    </p>
    <p>
      Ipsum ipsum consequat incididunt do aliquip pariatur nostrud. Qui ut sint
      culpa labore Lorem. Magna deserunt aliquip aute duis consectetur magna
      amet anim. Magna fugiat est nostrud veniam. Officia duis ea sunt aliqua.
    </p>
    <p>
      Ipsum minim officia aute anim minim aute aliquip aute non in non. Ipsum
      aliquip proident ut dolore eiusmod ad fugiat fugiat ut ex. Ea velit Lorem
      ut et commodo nulla voluptate veniam ea et aliqua esse id. Pariatur dolor
      et adipisicing ea mollit. Ipsum non irure proident ipsum dolore aliquip
      adipisicing laborum irure dolor nostrud occaecat exercitation.
    </p>
    <p>
      Culpa qui reprehenderit nostrud aliqua reprehenderit et ullamco proident
      nisi commodo non ut. Ipsum quis irure nisi sint do qui velit nisi. Sunt
      voluptate eu reprehenderit tempor consequat eiusmod Lorem irure velit duis
      Lorem laboris ipsum cupidatat. Pariatur excepteur tempor veniam cillum et
      nulla ipsum veniam ad ipsum ad aute. Est officia duis pariatur ad eiusmod
      id voluptate.
    </p>
  </div>
);

export default function SessionScheduler({
  isOpen,
  onOpenChange,
  instructorProfile,
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
    <Drawer
      className="bg-background border-t border-t-default-200"
      classNames={{
        backdrop: "bg-background/80 backdrop-opacity-50",
      }}
      isOpen={isOpen}
      placement="bottom"
      size="5xl"
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              <p>Select Date and Time</p>
              <small className="text-default-500">
                Choose your appointment date and time from the calender
              </small>
            </DrawerHeader>
            <DrawerBody className="flex flex-row justify-center">
              <div className="flex w-[393px] flex-col items-center gap-5 rounded-large bg-background shadow-small lg:w-fit lg:flex-row lg:items-start lg:px-6">
                <div className="flex flex-col gap-2 p-6 lg:w-[220px] lg:px-4 lg:pt-8">
                  <div>
                    <Avatar
                      src={`${IMAGE_BASE_URL}${instructorProfile.image}`}
                    />
                    <small className="text-default-500">
                      {instructorProfile.firstName} {instructorProfile.lastName}
                    </small>
                    <p className="font-medium">Video call</p>
                  </div>
                  <p className="text-sm line-clamp-5">
                    {instructorProfile.bio}
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
                    className="bg-background overflow-hidden"
                    classNames={{
                      cell: "p-1.5 w-full",
                      gridBodyRow:
                        "!gap-x-1 !px-3 !mb-1 !first:mt-4 !last:mb-0",
                      gridHeader: "!bg-transparent !shadow-none",
                      gridHeaderCell: "!text-default-400 !text-xs !p-0 !w-full",
                      gridHeaderRow: "px-3 pb-3",
                      gridWrapper: "pb-2",
                      headerWrapper: "bg-background",
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
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
