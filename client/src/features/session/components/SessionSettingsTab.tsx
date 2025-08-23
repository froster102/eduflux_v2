import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody } from "@heroui/card";
import { Switch } from "@heroui/switch";
import React from "react";

import FormModal from "@/components/FormModal";

import { SessionSettingsFormData } from "../validation/session-schema";
import { useEnableSessions } from "../hooks/useEnableSession";
import { useGetSessionSettings } from "../hooks/useGetSessionSettings";
import { useUpdateSessionSettings } from "../hooks/useUpdateSessionSettings";

import SessionSettingsForm from "./forms/SessionSettingsForm";

export default function SessionSettingsTab() {
  const [openEnableSessionModal, setOpenEnableSessionModal] =
    React.useState(false);
  const { data: sessionSettings, isLoading: isSessionSettingsLoading } =
    useGetSessionSettings();
  const updateSessionSettings = useUpdateSessionSettings();
  const enableSessions = useEnableSessions();

  function updateInstructorSessionSettingsHandler(
    data: Partial<SessionSettings>,
  ) {
    updateSessionSettings.mutate(data);
  }

  function enableSessionHandler(data: SessionSettingsFormData) {
    enableSessions.mutate(data);
  }

  return (
    <>
      <div>
        {isSessionSettingsLoading ? (
          <Skeleton className="rounded-lg bg-background">
            <div className="h-[424px]" />
          </Skeleton>
        ) : !sessionSettings?.settings ? (
          <Card>
            <CardBody>
              <div className="flex justify-between">
                <p>Enable Sessions</p>
                <Switch
                  aria-label="Automatic updates"
                  classNames={{
                    wrapper: "border border-default-500",
                  }}
                  isSelected={openEnableSessionModal}
                  onValueChange={(val) => {
                    setOpenEnableSessionModal(val);

                    return val;
                  }}
                />
              </div>
            </CardBody>
          </Card>
        ) : (
          <div>
            <SessionSettingsForm
              classNames={{
                gridLayout: "grid md:grid-cols-1 xl:grid-cols-2",
              }}
              initialValue={sessionSettings.settings}
              submitText="Update"
              onSubmitHandler={updateInstructorSessionSettingsHandler}
            />
          </div>
        )}
      </div>
      <FormModal
        form={
          <SessionSettingsForm
            isPending={enableSessions.isPending}
            submitText="Enable"
            onCancel={() => setOpenEnableSessionModal(false)}
            onSubmitHandler={enableSessionHandler}
          />
        }
        isOpen={openEnableSessionModal}
        size="4xl"
        title="Please set your session pricing and availability to continue"
        onClose={() => setOpenEnableSessionModal(false)}
      />
    </>
  );
}
