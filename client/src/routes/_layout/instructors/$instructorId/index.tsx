import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardBody, CardHeader } from "@heroui/card";
import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { getLocalTimeZone } from "@internationalized/date";
import { format } from "date-fns";

import SessionScheduler from "@/features/session/components/SessionScheduler";
import InstructorPageSkeleton from "@/features/instructor/components/InstructorPageSkeleton";
import { IMAGE_BASE_URL } from "@/config/image";
import BoltIcon from "@/components/icons/BoltIcon";
import { useBookSession } from "@/features/session/hooks/useBookSession";
import { tryCatch } from "@/utils/try-catch";
import { getInstructorProfileOptions } from "@/features/instructor/hooks/useGetInstructorProfile";
import { useGetInstructorAvailableSlots } from "@/features/instructor/hooks/useGetInstructorAvailableSlots";
import { useCreateChat } from "@/features/chat/hooks/useCreateChat";
import StartChatButton from "@/features/chat/components/StartChatButton";
import { useChatStore } from "@/store/useChatStore";
import { useGetChatWithInstructor } from "@/features/chat/hooks/useGetChatWithInstructor";

export const Route = createFileRoute("/_layout/instructors/$instructorId/")({
  loader: ({ context: { queryClient }, params: { instructorId } }) => {
    return queryClient.prefetchQuery(getInstructorProfileOptions(instructorId));
  },
  component: RouteComponent,
  errorComponent: () => {
    return <p>Error in this component</p>;
  },
  pendingComponent: () => <InstructorPageSkeleton />,
});

function RouteComponent() {
  const { instructorId } = Route.useParams();
  const { data: instructor } = useSuspenseQuery(
    getInstructorProfileOptions(instructorId),
  );
  const [selectedDate, setSelectedDate] = React.useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
  );
  const [selectedSlot, setSelectedAvailableSlot] =
    React.useState<AvailableSlots | null>(null);
  const [openScheduler, setOpenScheduler] = React.useState(false);
  const { data: availableSlots, isPending: isAvailableSlotsLoading } =
    useGetInstructorAvailableSlots({
      instructorId,
      date: selectedDate,
      timeZone: getLocalTimeZone(),
    });
  const {
    data: existingChat,
    isLoading: isExistingChat,
    isError: isChatError,
  } = useGetChatWithInstructor(instructorId);
  const navigte = useNavigate();
  const { setSelectedChat } = useChatStore();

  const bookSession = useBookSession();
  const createChat = useCreateChat();

  async function chatWithInstructorHandler() {
    if (existingChat && existingChat.chat) {
      setSelectedChat({
        id: existingChat.chat.id,
        lastMessageAt: existingChat.chat.lastMessageAt,
        lastMessagePreview: existingChat.chat.lastMessagePreview,
        participants: [
          {
            id: instructor.profile.id,
            name:
              instructor.profile.firstName + " " + instructor.profile.lastName,
            image: instructor.profile.image!,
          },
        ],
      });
      navigte({ to: `/chats` });

      return;
    }

    const { data: createdChat } = await tryCatch(
      createChat.mutateAsync(instructorId),
    );

    if (createdChat) {
      setSelectedChat({
        id: createdChat.id,
        lastMessageAt: createdChat.lastMessageAt,
        lastMessagePreview: createdChat.lastMessagePreview,
        participants: [
          {
            id: instructor.profile.id,
            name: `${instructor.profile.firstName + " " + instructor.profile.lastName}`,
            image: instructor.profile.image!,
          },
        ],
      });
      navigte({ to: `/chats` });
    }
  }

  async function bookSessionHandler(data: { slotId: string }) {
    const { data: response } = await tryCatch(bookSession.mutateAsync(data));

    if (response) {
      window.location.assign(response.checkoutUrl);
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex flex-col gap-4 w-full">
          <Card className="w-full h-fit bg-background border border-default-200">
            <CardHeader className="text-lg font-medium flex pb-0">
              <p>About Me</p>
            </CardHeader>
            <CardBody className="pt-0">
              <p>{instructor.profile.bio}</p>
            </CardBody>
          </Card>
        </div>

        <div className="w-fit order-1">
          <Card className="md:max-w-lg w-full bg-background border border-default-200">
            <CardHeader>
              <Image
                className="max-h-"
                height={400}
                src={`${IMAGE_BASE_URL}${instructor.profile.image}`}
                width={500}
              />
            </CardHeader>
            <CardBody className="flex flex-col gap-2">
              {/* <Skeleton isLoaded={!isSessionSettingsLoading}>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Price</p>
                  <p className="text-2xl font-semibold">
                    ${sessionSettings?.settings.price}/hr
                  </p>
                </div>
              </Skeleton> */}
              <Button
                color="primary"
                startContent={<BoltIcon />}
                onPress={() => setOpenScheduler(true)}
              >
                Book Session
              </Button>
              <StartChatButton
                errorLoading={isChatError}
                existingChat={
                  !isExistingChat && existingChat ? existingChat.chat : null
                }
                isLoading={isExistingChat}
                onClickHandler={chatWithInstructorHandler}
              />
            </CardBody>
          </Card>
        </div>
      </div>
      <SessionScheduler
        availableSlots={availableSlots!}
        instructor={instructor}
        isConfirmBookingPending={bookSession.isPending}
        isOpen={openScheduler}
        isSlotsLoading={isAvailableSlotsLoading}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        onConfirmBooking={bookSessionHandler}
        onOpenChange={(isOpen) => {
          setOpenScheduler(isOpen);
        }}
        onSelectedDateChange={(date) => setSelectedDate(date)}
        onSlotSelectionChange={(slot) => {
          setSelectedAvailableSlot(slot);
        }}
      />
    </>
  );
}
