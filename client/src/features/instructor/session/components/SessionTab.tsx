import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody } from "@heroui/card";
import { Switch } from "@heroui/switch";
import React from "react";

import { useGetInstructorSessionSettings } from "../hooks/useGetInstructorSessionSettings";
import { useUpdateInstructorSessionSettings } from "../hooks/useUpdateInstructorSessionSettings";
import { SessionSettingsFormData } from "../validation/session-schema";
import { useEnableSessions } from "../hooks/useEnableSession";

import SessionSettingsForm from "./forms/SessionSettingsForm";

import FormModal from "@/components/FormModal";

export default function SessionTab() {
  const [openEnableSessionModal, setOpenEnableSessionModal] =
    React.useState(false);
  const {
    data: instructorSessionSettings,
    isLoading: isInstructorSessionSettingsLoading,
  } = useGetInstructorSessionSettings();
  const updateInstructorInstructorSessionSettings =
    useUpdateInstructorSessionSettings();
  const enableSessions = useEnableSessions();

  function updateInstructorSessionSettingsHandler(
    data: Partial<SessionSettings>,
  ) {
    updateInstructorInstructorSessionSettings.mutate(data);
  }

  function enableSessionHandler(data: SessionSettingsFormData) {
    enableSessions.mutate(data);
  }

  return (
    <>
      <div>
        {isInstructorSessionSettingsLoading ? (
          <Skeleton className="rounded-lg bg-background">
            <div className="h-[424px]" />
          </Skeleton>
        ) : !instructorSessionSettings?.settings ? (
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
              initialValue={instructorSessionSettings.settings}
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
