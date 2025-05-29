import { Divider } from "@heroui/divider";
import React from "react";
import { Skeleton } from "@heroui/skeleton";
import { useMotionValueEvent, useScroll } from "framer-motion";

import { useAuthStore } from "@/store/auth-store";
import { useGetUserSessionsQuery } from "@/features/auth/hooks/queries";
import { formatTo12HourWithDate } from "@/utils/date";
import ProfileCard from "@/components/ProfileCard";
import RecentDevicesCard from "@/components/RecentDevicesCard";
import ProfileForm from "@/components/ProfileForm";
import PasswordForm from "@/components/PasswordForm";
import { useGetTutorQuery } from "@/features/instructor/hooks/queries";
import { useLayoutStore } from "@/store/layout-store";
import { useUpdateTutorProfileMutation } from "@/features/instructor/account/hooks/mutaions";

export default function AccountPage() {
  const {
    user: { userId, role },
  } = useAuthStore();
  const { data: userProfile, isLoading: isUserProfileLoading } =
    useGetTutorQuery(userId);
  const { data: userSessions, isLoading: isUserSessionsLoading } =
    useGetUserSessionsQuery();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollContainerRef });
  const { setShowSidebar } = useLayoutStore();
  const updateTutorProfileMutation = useUpdateTutorProfileMutation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() as number;

    if (latest > previous) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  });

  const activeSession = React.useMemo(() => {
    if (userSessions?.currentSession) {
      return userSessions.sessions.find(
        (session) => session.id === userSessions.currentSession,
      );
    }
  }, [userSessions]);

  function onSubmit(data: Partial<Tutor>) {
    updateTutorProfileMutation.mutate({
      userId,
      updateData: data,
    });
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">Account</p>
          <small className="text-default-500 text-sm">
            Your account details have been given below
          </small>
        </div>
      </div>
      <Divider className="mt-4" orientation="horizontal" />
      <div
        ref={scrollContainerRef}
        className=" md:flex w-full gap-4 pt-4 px-0 md:px-4 lg:px-14 overflow-auto scrollbar-hide"
      >
        <div className=" md:max-w-[424px] w-full h-fit">
          {isUserProfileLoading ? (
            <p>Loading user profile...</p>
          ) : (
            <ProfileCard
              accountStatus={userProfile?.isActive || true}
              email={userProfile?.email || ""}
              id={
                role === "STUDENT"
                  ? userProfile?.student?.id
                  : userProfile?.tutor?.id
              }
              lastLogin={
                activeSession?.lastLogin
                  ? formatTo12HourWithDate(new Date(activeSession?.lastLogin))
                  : ""
              }
              name={userProfile?.firstName + " " + userProfile?.lastName}
            />
          )}

          <div className="pt-4  hidden md:block">
            <RecentDevicesCard
              activeSession={activeSession!}
              isLoading={isUserSessionsLoading}
              userSessions={userSessions?.sessions!}
            />
          </div>
        </div>
        <div className="w-full max-h-screen pt-4 md:pt-0 md:overflow-y-auto scrollbar-hide">
          <Skeleton
            className="rounded-lg bg-background"
            isLoaded={!isUserProfileLoading}
          >
            {!isUserProfileLoading && (
              <ProfileForm
                initialValues={userProfile!}
                onSubmitHandler={onSubmit}
              />
            )}
          </Skeleton>
          <div className="pt-4">
            <PasswordForm />
          </div>
          <div className="pt-4 block md:hidden">
            <RecentDevicesCard
              activeSession={activeSession!}
              isLoading={isUserSessionsLoading}
              userSessions={userSessions?.sessions!}
            />
          </div>
        </div>
      </div>
    </>
  );
}
