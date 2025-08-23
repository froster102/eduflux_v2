import { createFileRoute } from "@tanstack/react-router";
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
import MessageIcon from "@/components/icons/MessageIcon";
import { useBookSession } from "@/features/session/hooks/useBookSession";
import { tryCatch } from "@/utils/try-catch";
import { getInstructorProfileOptions } from "@/features/instructor/hooks/useGetInstructorProfile";
import { useGetInstructorAvailableSlots } from "@/features/instructor/hooks/useGetInstructorAvailableSlots";

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

const sampleBio =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturideleniti id commodi quis aliquam obcaecati tenetur atque. Veritatisdolore doloribus, ipsum eaque soluta nam, aspernatur fugitperferendis optio officiis id. Lorem ipsum dolor sit amet consecteturadipisicing elit. Excepturi deleniti id commodi quis aliquam obcaecatitenetur atque. Veritatis dolore doloribus, ipsum eaque soluta nam,aspernatur fugit perferendis optio officiis id. Lorem ipsum dolor sitamet consectetur adipisicing elit. Excepturi deleniti id commodi quisaliquam obcaecati tenetur atque. Veritatis dolore doloribus, ipsumeaque soluta nam, aspernatur fugit perferendis optio officiis id.Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturideleniti id commodi quis aliquam obcaecati tenetur atque. Veritatisdolore doloribus, ipsum eaque soluta nam, aspernatur fugitperferendis optio officiis id. Lorem ipsum dolor sit amet consecteturadipisicing elit. Excepturi deleniti id commodi quis aliquam obcaecatitenetur atque. Veritatis dolore doloribus, ipsum eaque soluta nam,aspernatur fugit perferendis optio officiis id. Lorem ipsum dolor sitamet consectetur adipisicing elit. Excepturi deleniti id commodi quisaliquam obcaecati tenetur atque. Veritatis dolore doloribus, ipsumeaque soluta nam, aspernatur fugit perferendis optio officiis id.";

function RouteComponent() {
  const { instructorId } = Route.useParams();
  const { data: instructorProfile } = useSuspenseQuery(
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
  const bookSession = useBookSession();

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
              <p>{sampleBio}</p>
            </CardBody>
          </Card>
          <Card className="w-full h-fit bg-background border border-default-200">
            <CardHeader className="text-lg font-medium flex pb-0">
              <p>My Courses(7)</p>
            </CardHeader>
            <CardBody className="pt-0">
              <p>list courses</p>
            </CardBody>
          </Card>
        </div>

        <div className="w-fit order-1">
          <Card className="md:max-w-lg w-full bg-background border border-default-200">
            <CardHeader>
              <Image
                height={400}
                src={`${IMAGE_BASE_URL}${instructorProfile.image}`}
                width={500}
              />
            </CardHeader>
            <CardBody className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">Price</p>
                <p className="text-2xl font-semibold">
                  ${instructorProfile?.sessionPricing?.price}/hr
                </p>
              </div>
              <Button
                color="primary"
                startContent={<BoltIcon />}
                onPress={() => setOpenScheduler(true)}
              >
                Book Session
              </Button>
              <Button
                color="primary"
                startContent={<MessageIcon />}
                variant="bordered"
              >
                Send a message
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
      <SessionScheduler
        availableSlots={availableSlots!}
        instructorProfile={instructorProfile!}
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
