import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";

import SettingsLayout from "@/layout/SettingsLayout";
import ProfileTab from "@/features/profile/components/ProfileTab";
import AccountTab from "@/features/account/components/AccountTab";
import { useAuthStore } from "@/store/auth-store";
import { useGetUserSessions } from "@/features/account/hooks/useGetUserSessions";
import SessionSettingsTab from "@/features/session/components/SessionSettingsTab";
import { tabSchema } from "@/utils/schema/tabSchema";

export const Route = createFileRoute("/_layout/settings/")({
  component: RouteComponent,
  validateSearch: tabSchema,
});

type TabType = "profile" | "account" | "session";

function RouteComponent() {
  const { user } = useAuthStore();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();

  const { data: sessions, isLoading: isSessionsLoading } = useGetUserSessions();

  const tabKeys = [
    "profile",
    "account",
    ...(user && user.roles.includes("INSTRUCTOR") ? ["session"] : []),
  ];

  const tabs: Record<TabType, React.ReactNode> = React.useMemo(() => {
    return {
      profile: <ProfileTab />,
      account: <AccountTab />,
      session: <SessionSettingsTab />,
    };
  }, []);

  const getSelectedTab = (key: TabType) => {
    return tabs[key];
  };

  const updateTab = (key: TabType) => {
    navigate({ to: `/settings?tab=${key}` });
  };

  return (
    <SettingsLayout
      getSelectedTab={(key) => getSelectedTab(key as TabType)}
      isSessionsLoading={isSessionsLoading}
      selectedTab={tab}
      sessions={sessions}
      tabKeys={tabKeys}
      user={user!}
      onTabChange={(key) => updateTab(key as TabType)}
    />
  );
}
