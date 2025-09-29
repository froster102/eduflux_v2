import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";

import { getDeviceName } from "@/utils/helpers";
import { formatTo12HourWithDate } from "@/utils/date";
import ConfirmationModal from "@/components/ConfirmationModal";

interface RecentDevicesCardProps {
  sessions: Session[];
  activeSession: Session;
}

export default function RecentDevicesCard({
  sessions,
  activeSession,
}: RecentDevicesCardProps) {
  const [openConfirmationModal, setOpenConfirmationModal] =
    React.useState(false);

  const imageMapping: Record<string, any> = {
    Desktop: "/desktop_device.png",
    Mobile: "/mobile_device.png",
  };

  function handleSessionTermination() {
    // terminateSessionMutation.mutate(selectedSession);
    setOpenConfirmationModal(false);
  }

  return (
    <>
      <Card
        className="bg-background border border-default-200"
        radius="sm"
        shadow="none"
      >
        <CardHeader>
          <p className="font-medium">Recent Devices</p>
        </CardHeader>
        <Divider orientation="horizontal" />
        <CardBody>
          {sessions.map((session) => {
            const deviceInfo = getDeviceName(session.userAgent!);

            return (
              <div key={session.id} className="pt-2">
                <Card radius="sm" shadow="sm">
                  <CardBody className="p-2">
                    <div className="flex">
                      <div className="flex items-center gap-2">
                        <img
                          alt=""
                          className="h-[32px]"
                          src={
                            imageMapping[
                              deviceInfo.deviceCategory.split(" ")[0]
                            ]
                          }
                        />
                        <div>
                          <p>{deviceInfo.deviceCategory}</p>
                          <p className="text-xs text-zinc-600">
                            {deviceInfo.browser.name || "unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm flex justify-between">
                      <div>
                        <p>IP Address: {session.ipAddress}</p>
                        <p>
                          Created At:{" "}
                          {formatTo12HourWithDate(new Date(session.createdAt))}
                        </p>
                      </div>
                      <div className="flex items-end">
                        {session.id !== activeSession?.id && (
                          <Button
                            className="p-2  max-h-[24px]"
                            color="primary"
                            size="sm"
                            onPress={() => {
                              setOpenConfirmationModal(true);
                            }}
                          >
                            Terminate
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            );
          })}
        </CardBody>
      </Card>
      <ConfirmationModal
        isOpen={openConfirmationModal}
        message={"Are you sure that you want to terminate this session ?"}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={handleSessionTermination}
      />
    </>
  );
}
