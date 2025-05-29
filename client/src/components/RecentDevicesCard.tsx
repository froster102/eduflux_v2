interface RecentDevicesCard {
  userSessions: Session[];
  activeSession: Session;
  isLoading: boolean;
}

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import React from "react";

import { useTerminateSessionMutation } from "@/features/auth/hooks/mutations";
import DesktopDevice from "@/assets/desktop_device.png";
import MobileDevice from "@/assets/mobile_device.png";
import { getDeviceName } from "@/utils/helpers";
import { formatTo12HourWithDate } from "@/utils/date";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function RecentDevicesCard({
  userSessions,
  isLoading,
  activeSession,
}: RecentDevicesCard) {
  const [selectedSession, setSelectedSession] = React.useState<string>("");
  const [openConfirmationModal, setOpenConfirmationModal] =
    React.useState(false);

  const imageMapping: Record<string, any> = {
    Desktop: DesktopDevice,
    Mobile: MobileDevice,
  };

  const terminateSessionMutation = useTerminateSessionMutation();

  function handleSessionTermination() {
    terminateSessionMutation.mutate(selectedSession);
    setOpenConfirmationModal(false);
  }

  return (
    <>
      <Card className="bg-background" radius="sm" shadow="sm">
        <CardHeader>
          <p className="font-medium">Recent Devices</p>
        </CardHeader>
        <Divider orientation="horizontal" />
        <CardBody>
          {isLoading ? (
            <p>Loading user sessions...</p>
          ) : (
            userSessions?.map((session) => {
              const deviceInfo = getDeviceName(session.deviceInfo);

              return (
                <div key={session.id} className="pt-2">
                  <Card
                    className="bg-zinc-200 dark:bg-secondary border-zinc-100"
                    radius="sm"
                    shadow="sm"
                  >
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
                            {formatTo12HourWithDate(
                              new Date(session.createdAt),
                            )}
                          </p>
                        </div>
                        <div className="flex items-end">
                          {session.id !== activeSession?.id && (
                            <Button
                              className="p-2  max-h-[24px]"
                              color="primary"
                              size="sm"
                              onPress={() => {
                                setSelectedSession(session.id);
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
            })
          )}
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
