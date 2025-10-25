import { Button } from '@heroui/button';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Card, CardBody, CardHeader } from '@heroui/card';
import React from 'react';
import { Tooltip } from '@heroui/tooltip';
import { Skeleton } from '@heroui/skeleton';
import { useDisclosure } from '@heroui/modal';

import { useGetUserSessions } from '@/features/session/hooks/useGetUserSessions';
import PaginationWithNextAndPrevious from '@/components/Pagination';
import { Role } from '@/shared/enums/Role';
import SettingsIcon from '@/components/icons/SettingsIcon';
import FormModal from '@/components/FormModal';
import SessionSettingsForm from '@/features/session/components/forms/SessionSettingsForm';
import { useUpdateSessionSettings } from '@/features/session/hooks/useUpdateSessionSettings';
import { useEnableSessions } from '@/features/session/hooks/useEnableSession';
import { SessionSettingsFormData } from '@/features/session/validation/session-schema';
import { useGetSessionSettings } from '@/features/session/hooks/useGetSessionSettings';
import SessionCard from '@/features/session/components/SessionCard';

export const Route = createFileRoute('/instructor/_layout/sessions/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [page, setPage] = React.useState(1);
  const navigate = useNavigate();
  const { data: sessionsQueryResult } = useGetUserSessions({
    page: {
      number: page,
    },
    filter: {
      preferedRole: Role.INSTRUCTOR,
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: sessionSettings, isLoading: isSessionSettingsLoading } =
    useGetSessionSettings();

  const updateSessionSettings = useUpdateSessionSettings();
  const enableSessions = useEnableSessions();

  const isEnabled = !!sessionSettings?.data.settings;

  const handleEnableSessions = (data: SessionSettingsFormData) => {
    enableSessions.mutate(data, {
      onSuccess: () => onClose(),
    });
  };

  const handleUpdateSettings = (data: Partial<SessionSettingsFormData>) => {
    updateSessionSettings.mutate(data, {
      onSuccess: () => onClose(),
    });
  };

  if (isSessionSettingsLoading) {
    return new Array(10).fill(0).map((_, i) => (
      <Skeleton key={i} className="rounded-lg !bg-default-200 mt-2">
        <div className="h-[144px]" />
      </Skeleton>
    ));
  }

  if (!isEnabled) {
    return (
      <>
        <Card
          className="max-w-xl mx-auto mt-10 bg-transparent border border-default-200"
          shadow="none"
        >
          <CardHeader>
            <h2 className="text-lg font-semibold">Session Availability</h2>
          </CardHeader>
          <CardBody>
            <div className="flex justify-between items-center">
              <p>
                To start hosting sessions, please configure your pricing and
                availability.
              </p>
              <Button color="primary" onPress={onOpen}>
                Enable Sessions
              </Button>
            </div>
          </CardBody>
        </Card>

        <FormModal
          form={
            <SessionSettingsForm
              isPending={enableSessions.isPending}
              submitText="Enable & Save"
              onCancel={onClose}
              onSubmitHandler={handleEnableSessions}
            />
          }
          isOpen={isOpen}
          size="4xl"
          title="Setup Your Session Settings"
          onClose={onClose}
        />
      </>
    );
  }

  const handlerJoinSession = (session: UserSession) => {
    navigate({
      to: `/meetings/${session.id}?returnTo=/instructor/sessions`,
      replace: true,
    });
  };

  return (
    <>
      <div className="relative h-full">
        <Tooltip content="Click to view and update session settings">
          <Button
            isIconOnly
            className="absolute bottom-10 right-0 z-10"
            color="primary"
            startContent={<SettingsIcon />}
            onPress={onOpen}
          />
        </Tooltip>

        {sessionsQueryResult &&
          sessionsQueryResult.data.map((session) => (
            <SessionCard
              key={session.id}
              role={Role.INSTRUCTOR}
              session={session}
              onJoin={handlerJoinSession}
            />
          ))}
        {sessionsQueryResult && sessionsQueryResult.meta.totalPages > 1 && (
          <div className="pt-4 flex w-full justify-center">
            <PaginationWithNextAndPrevious
              currentPage={sessionsQueryResult.meta.pageNumber}
              totalPages={sessionsQueryResult.meta.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <FormModal
        form={
          <SessionSettingsForm
            classNames={{
              gridLayout: 'grid md:grid-cols-1 xl:grid-cols-2',
            }}
            initialValue={sessionSettings.data.settings}
            isPending={updateSessionSettings.isPending}
            submitText="Update Settings"
            onCancel={onClose}
            onSubmitHandler={handleUpdateSettings}
          />
        }
        isOpen={isOpen}
        size="4xl"
        title="Update Session Pricing and Availability"
        onClose={onClose}
      />
    </>
  );
}
