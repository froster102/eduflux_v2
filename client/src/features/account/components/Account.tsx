import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody, CardHeader } from "@heroui/card";
import React from "react";
import { Tab, Tabs } from "@heroui/tabs";

import { useGetUserProfile } from "../hooks/useGetUserProfile";
import { useGetUserSessions } from "../hooks/useGetUserSessions";
import { useUpdatePassword } from "../hooks/useUpdatePassword";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

import ProfileCard from "./ProfileCard";
import SessionPriceForm from "./forms/SessionPriceForm";

import { useAuthStore } from "@/store/auth-store";
import PasswordForm from "@/features/account/components/forms/PasswordForm";
import ProfileForm from "@/features/account/components/forms/ProfileForm";
import RecentDevicesCard from "@/features/account/components/RecentDevicesCard";
import { IMAGE_BASE_URL } from "@/config/image";

type TabKey = "profile" | "account" | "session";

export default function Account() {
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = React.useState<TabKey>("profile");
  const { data: profile, isLoading: isProfileLoading } = useGetUserProfile({
    enabled: selectedTab === "profile",
  });
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

  function getSelectedTabComponent() {
    switch (selectedTab) {
      case "profile": {
        return (
          <>
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
          </>
        );
      }
      case "account":
        return (
          <>
            <PasswordForm
              isPending={updatePassword.isPending}
              onSubmitHandler={onUpdatePasswordHandler}
            />
          </>
        );

      case "session": {
        return (
          <>
            {user?.roles.includes("INSTRUCTOR") && (
              <div className="pt-4">
                <SessionPriceForm />
              </div>
            )}
          </>
        );
      }

      default: {
        return <></>;
      }
    }
  }

  return (
    <>
      <div
        className="flex flex-col md:flex md:flex-row w-full max-h-screen h-full gap-4 md:overflow-x-scroll scrollbar-hide scroll-smooth"
        data-lenis="false"
      >
        <div className="flex flex-col gap-4 max-w-md w-full">
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

        <div className="w-full md:max-h-screen h-full md:overflow-y-auto scrollbar-hide">
          <Card
            className="bg-background border border-default-200 w-full h-full p-2"
            radius="sm"
            shadow="sm"
          >
            <CardHeader className="p-0">
              <Tabs
                aria-label="Tabs variants"
                selectedKey={selectedTab}
                variant={"underlined"}
                onSelectionChange={(key) => setSelectedTab(key as TabKey)}
              >
                <Tab key="profile" title="Profile" />
                <Tab key="account" title="Account" />
                {user?.roles.includes("INSTRUCTOR") && (
                  <Tab key="session" title="Session" />
                )}
              </Tabs>
            </CardHeader>
            <CardBody>{getSelectedTabComponent()}</CardBody>
          </Card>
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
