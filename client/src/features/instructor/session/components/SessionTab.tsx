import { Skeleton } from "@heroui/skeleton";
import { Divider } from "@heroui/divider";

import { useGetUserSessionPricing } from "../hooks/useGetUserSessionPricing";
import { useUpdateUserSessionPricing } from "../hooks/useUpdateUserSessionPricing";
import {
  AvailabilityFormData,
  SessionPricingFormData,
} from "../validation/session-schema";
import { useGetInstructorScheduleSetting } from "../hooks/useGetInstructorScheduleSettings";
import { useUpdateInstructorAvailability } from "../hooks/useUpdateInstructorAvailability";

import SessionPricingForm from "./forms/SessionPriceForm";
import ScheduleSettingForm from "./forms/ScheduleSettingForm";

import { useAuthStore } from "@/store/auth-store";

export default function SessionTab() {
  const { user } = useAuthStore();
  const { data: userSessionPricing, isLoading: isUserSessionPriceLoading } =
    useGetUserSessionPricing();
  const updateUserSessionPricing = useUpdateUserSessionPricing();
  const {
    data: instructorScheduleSetting,
    isLoading: isInstructorScheduleSettingLoading,
  } = useGetInstructorScheduleSetting();
  const updateInstructorAvailability = useUpdateInstructorAvailability();

  function updateUserSessionPricingHandler(data: SessionPricingFormData) {
    updateUserSessionPricing.mutate({
      price: data.price,
    });
  }

  function updateScheduleSettingHandler(data: AvailabilityFormData) {
    updateInstructorAvailability.mutate(data);
  }

  return (
    <div>
      {user!.roles.includes("INSTRUCTOR") ? (
        isUserSessionPriceLoading ? (
          <Skeleton className="rounded-lg bg-background">
            <div className="h-[424px]" />
          </Skeleton>
        ) : (
          <div>
            <SessionPricingForm
              initialValue={
                userSessionPricing ? userSessionPricing! : undefined
              }
              isPending={updateUserSessionPricing.isPending}
              onSubmitHandler={updateUserSessionPricingHandler}
            />
          </div>
        )
      ) : null}
      <Divider className="my-4" />
      <div className="xl:flex items-center gap-2">
        {isInstructorScheduleSettingLoading ? (
          <Skeleton className="w-full rounded-lg">
            <div className="h-[400px]">Loading</div>
          </Skeleton>
        ) : (
          <ScheduleSettingForm
            initialValue={instructorScheduleSetting?.setting!}
            isPending={updateInstructorAvailability.isPending}
            onSubmitHandler={updateScheduleSettingHandler}
          />
        )}
        <div className="w-full flex gap-4 flex-col pt-4">
          <div>
            <p className="font-semibold text-lg">Scheduling Tips</p>
            <small className="text-zinc-500">
              Set realistic hours that align with your energy levels and
              personal commitments.
            </small>
          </div>
          <Divider orientation="horizontal" />
          <div>
            <p className="font-semibold text-lg">Consider Time Zones</p>
            <small className="text-zinc-500">
              If you have clients globally, specify your availability in a way
              that&apos;s clear across different time zones.
            </small>
          </div>
          <Divider orientation="horizontal" />
          <div>
            <p className="font-semibold text-lg">Flexibility is Key</p>
            <small className="text-zinc-500">
              Offer a range of slots to accommodate diverse client schedules
              where possible.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
