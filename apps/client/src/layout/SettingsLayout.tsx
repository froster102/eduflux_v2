import { Card, CardBody, CardHeader } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';
import { Tab, Tabs } from '@heroui/tabs';
import React from 'react';

import RecentDevicesCard from '@/components/RecentDevicesCard';
import ProfileCard from '@/components/ProfileCard';
import { IMAGE_BASE_URL } from '@/config/image';

interface SettingsLayoutProps {
  user: User;
  tabKeys: string[];
  selectedTab: string;
  onTabChange: (tabKey: string) => void;
  getSelectedTab: (tabKey: string) => React.ReactNode;
  sessions?: Session[];
  isSessionsLoading: boolean;
}

export default function SettingsLayout({
  user,
  tabKeys,
  selectedTab,
  onTabChange,
  getSelectedTab,
  sessions,
  isSessionsLoading,
}: SettingsLayoutProps) {
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
        className="flex flex-col md:flex md:flex-row w-full max-h-screen h-full gap-4 md:overflow-x-scroll scrollbar-hide scroll-smooth"
        data-lenis="false"
      >
        <div className="flex flex-col gap-4 md:max-w-md w-full">
          <ProfileCard
            email={user!.email}
            image={`${IMAGE_BASE_URL}${user?.image}`}
            lastLogin={latestSession?.createdAt}
            name={user?.name || ''}
          />

          <div className="hidden md:block">
            {isSessionsLoading ? (
              new Array(3).fill(0).map((_, i) => (
                <div key={i} className="pt-2">
                  <Skeleton key={i} className="rounded-md">
                    <Card className="max-w-md w-full h-[90px]" />
                  </Skeleton>
                </div>
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
                aria-label="Settings Tabs"
                classNames={{
                  tab: 'capitalize',
                }}
                selectedKey={selectedTab}
                variant={'underlined'}
                onSelectionChange={(key) => onTabChange(key.toString())}
              >
                {tabKeys.map((key) => (
                  <Tab key={key} title={key} />
                ))}
              </Tabs>
            </CardHeader>
            <CardBody>{getSelectedTab(selectedTab)}</CardBody>
          </Card>
        </div>
        <div className="md:hidden">
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
