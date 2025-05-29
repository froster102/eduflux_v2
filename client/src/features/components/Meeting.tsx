/* eslint-disable jsx-a11y/media-has-caption */
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import React from "react";
import { Alert } from "@heroui/alert";
import { Spinner } from "@heroui/spinner";
import { useNavigate } from "react-router";

import MeetingMessager from "./MeetingMessager";

import { useAuthStore } from "@/store/auth-store";
import { MeetingContext, MeetingContextType } from "@/context/MeetingContext";

export default function Meeting() {
  const {
    mainScreenRef,
    localScreenRef,
    toggleAudio,
    toggleVideo,
    isAudioOff,
    isVideoOff,
    isCallActive,
    remoteStream,
    endCall,
  } = React.useContext(MeetingContext) as MeetingContextType;
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-3xl font-bold">Meeting</p>
          <small className="text-sm text-default-500">
            Below is your space for session meeting
          </small>
        </div>
      </div>
      <Divider className="mt-4" orientation="horizontal" />
      <div className="pt-4 md:flex overflow-hidden h-full gap-4">
        <div className="flex  flex-col w-full h-full">
          <Card className="h-full w-full overflow-hidden relative bg-background">
            <CardBody className="p-0 relative overflow-hidden">
              {!isCallActive && (
                <Alert
                  hideIcon
                  className="max-w-sm absolute z-50 top-4 left-2"
                  classNames={{
                    base: "flex items-center",
                  }}
                  startContent={<Spinner />}
                  title={"Status"}
                  variant="flat"
                >
                  <p className="text-sm">
                    Waiting for {user.role === "STUDENT" ? "tutor" : "student"}
                  </p>
                </Alert>
              )}
              <video
                ref={mainScreenRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full aspect-video"
                style={{
                  transform: "scaleX(-1)",
                }}
              />
            </CardBody>
            {remoteStream && (
              <Card className="absolute bottom-4 right-4">
                <CardBody className="p-0">
                  <video
                    ref={localScreenRef}
                    autoPlay
                    playsInline
                    className="max-w-sm max-h-[200px]"
                    style={{
                      transform: "scaleX(-1)",
                    }}
                  />
                </CardBody>
              </Card>
            )}
          </Card>
          <div className="flex justify-center gap-4 py-4">
            <Button
              isIconOnly
              color={isAudioOff ? "danger" : "default"}
              radius="full"
              size="lg"
              onPress={toggleAudio}
            >
              {isAudioOff ? <MicOff /> : <Mic />}
            </Button>
            <Button
              isIconOnly
              color={isVideoOff ? "danger" : "default"}
              radius="full"
              size="lg"
              onPress={toggleVideo}
            >
              {isVideoOff ? <VideoOff /> : <Video />}
            </Button>
            <Button
              isIconOnly
              className="rotate-[133deg]"
              color={"danger"}
              radius="full"
              size="lg"
              onPress={() => {
                endCall();
                switch (user.role) {
                  case "TUTOR":
                    navigate("/tutor/sessions");
                    break;
                  case "STUDENT":
                    navigate("/sessions");
                    break;
                }
              }}
            >
              <Phone />
            </Button>
          </div>
        </div>
        <MeetingMessager />
      </div>
    </>
  );
}
