import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";
import React from "react";

import ProfileCard from "./ProfileCard";

import {
  useGetUserProfile,
  useGetUserSessions,
} from "@/features/account/hooks/queries";
import { useAuthStore } from "@/store/auth-store";
import PasswordForm from "@/features/account/components/forms/PasswordForm";
import ProfileForm from "@/features/account/components/forms/ProfileForm";
import {
  useUpdatePassword,
  useUpdateProfile,
} from "@/features/account/hooks/mutations";
import RecentDevicesCard from "@/features/account/components/RecentDevicesCard";

export default function Account() {
  const { user } = useAuthStore();
  const { data: profile, isLoading: isProfileLoading } = useGetUserProfile(
    user!.id,
  );
  const { data: sessions, isLoading: isSessionsLoading } = useGetUserSessions();
  const updatePassword = useUpdatePassword();
  const updateProfile = useUpdateProfile();

  function onProfileUpdateHandler(data: Partial<UserProfile>) {
    updateProfile.mutate(data);
  }

  function onUpdatePasswordHandler(data: UpdatePasswordFormData) {
    updatePassword.mutate({
      newPassword: data.newPassword,
      currentPassword: data.currentPassword,
    });
  }

  const latestSession = React.useMemo(() => {
    if (sessions) {
      return [...sessions].sort(
        (a, b) =>
          (b.createdAt as unknown as number) -
          (a.createdAt as unknown as number),
      )[0];
    }

    return null;
  }, [isSessionsLoading, sessions]);

  return (
    <>
      <Divider className="mt-4" orientation="horizontal" />
      <div
        className="md:flex w-full gap-4 pt-4 px-0 md:px-4 lg:px-14 overflow-x-scroll scrollbar-hide scroll-smooth"
        data-lenis="false"
      >
        <div className="max-w-md w-full h-fit">
          {isProfileLoading || isSessionsLoading ? (
            <Skeleton className="rounded-md" isLoaded={!isProfileLoading}>
              {<div className="rounded-md h-56" />}
            </Skeleton>
          ) : (
            <ProfileCard
              email={user!.email}
              lastLogin={latestSession?.createdAt}
              name={profile?.firstName + " " + profile?.lastName}
            />
          )}

          <div className="pt-4  md:block">
            {isSessionsLoading ? (
              new Array(3).fill(0).map((_, i) => (
                <Skeleton key={i}>
                  <Card className="max-w-md w-full h-[124px]" />
                </Skeleton>
              ))
            ) : (
              <RecentDevicesCard
                activeSession={sessions![0]}
                sessions={sessions!}
              />
            )}
          </div>
        </div>
        <div className="w-full max-h-screen md:pt-0 md:overflow-y-auto scrollbar-hide">
          <Skeleton
            className="rounded-lg bg-background"
            isLoaded={!isProfileLoading}
          >
            {!isProfileLoading && (
              <ProfileForm
                initialValue={profile!}
                onSubmitHandler={onProfileUpdateHandler}
              />
            )}
          </Skeleton>
          <div className="pt-4">
            <PasswordForm
              isPending={updatePassword.isPending}
              onSubmitHandler={onUpdatePasswordHandler}
            />
          </div>
          <div className="pt-4 block md:hidden">
            {/* <RecentDevicesCard
              activeSession={activeSession!}
              isLoading={isUserSessionsLoading}
              userSessions={userSessions?.sessions!}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}
