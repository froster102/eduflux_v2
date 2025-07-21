import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";
import React from "react";

import { useGetUserProfile } from "../hooks/useGetUserProfile";
import { useGetUserSessions } from "../hooks/useGetUserSessions";
import { useUpdatePassword } from "../hooks/useUpdatePassword";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

import ProfileCard from "./ProfileCard";

import { useAuthStore } from "@/store/auth-store";
import PasswordForm from "@/features/account/components/forms/PasswordForm";
import ProfileForm from "@/features/account/components/forms/ProfileForm";
import RecentDevicesCard from "@/features/account/components/RecentDevicesCard";
import { IMAGE_BASE_URL } from "@/config/image";

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
      <div
        className="flex flex-col md:flex md:flex-row w-full gap-4 px-0 md:px-4 lg:px-6 md:overflow-x-scroll scrollbar-hide scroll-smooth"
        data-lenis="false"
      >
        <div className="flex flex-col gap-4 max-w-md w-full h-fit">
          {isProfileLoading || isSessionsLoading ? (
            <Skeleton className="rounded-md" isLoaded={!isProfileLoading}>
              {<div className="rounded-md h-56" />}
            </Skeleton>
          ) : (
            <ProfileCard
              email={user!.email}
              image={`${IMAGE_BASE_URL}${user?.image}`}
              lastLogin={latestSession?.createdAt}
              name={profile?.firstName + " " + profile?.lastName}
            />
          )}

          <div className="hidden md:block">
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
        <div className="w-full md:max-h-screen md:overflow-y-auto scrollbar-hide">
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
        </div>
        <div className="block md:hidden">
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
    </>
  );
}
