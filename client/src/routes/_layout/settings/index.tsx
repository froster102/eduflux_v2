import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import SettingsLayout from "@/layout/SetingsLayout";
import ProfileTab from "@/features/profile/components/ProfileTab";
import AccountTab from "@/features/account/components/AccountTab";
import { useAuthStore } from "@/store/auth-store";
import { useGetUserSessions } from "@/features/account/hooks/useGetUserSessions";
import SessionSettingsTab from "@/features/session/components/SessionSettingsTab";

export const Route = createFileRoute("/_layout/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = React.useState("profile");
  const { data: sessions, isLoading: isSessionsLoading } = useGetUserSessions();

  const tabKeys = [
    "profile",
    "account",
    ...(user && user.roles.includes("INSTRUCTOR") ? ["session"] : []),
  ];

  const tabs: Record<string, React.ReactNode> = React.useMemo(() => {
    return {
      profile: <ProfileTab />,
      account: <AccountTab />,
      session: <SessionSettingsTab />,
    };
  }, []);

  const getSelectedTab = (key: string) => {
    return tabs[key];
  };

  return (
    <SettingsLayout
      getSelectedTab={getSelectedTab}
      isSessionsLoading={isSessionsLoading}
      selectedTab={selectedTab}
      sessions={sessions}
      setSelectedTab={(key) => setSelectedTab(key)}
      tabKeys={tabKeys}
      user={user!}
    />
  );
}
