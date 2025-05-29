import { addToast } from "@heroui/toast";
import React from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router";

import { useAuthStore } from "@/store/auth-store";

export interface MeetingContextType {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  mainScreenRef: React.RefObject<HTMLVideoElement>;
  localScreenRef: React.RefObject<HTMLVideoElement>;
  isCallActive: boolean;
  isVideoOff: boolean;
  isAudioOff: boolean;
  messages: Messages;
  sendMessage: (message: string) => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  endCall: () => void;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
}

type Messages = Array<{
  message: string;
  date: Date;
  type: "received" | "sent";
}>;

export const MeetingContext = React.createContext<
  MeetingContextType | undefined
>(undefined);

interface MeetingProviderProps {
  children: React.ReactNode;
}

export const MeetingProvider: React.FC<MeetingProviderProps> = ({
  children,
}) => {
  const { sessionId } = useParams();

  const [localStream, setLocalStream] = React.useState<MediaStream | null>(
    null,
  );
  const [remoteStream, setRemoteStream] = React.useState<MediaStream | null>(
    null,
  );
  const [messages, setMessages] = React.useState<Messages>([]);
  const [isVideoOff, setIsVideoOff] = React.useState(false);
  const [isAudioOff, setIsAudioOff] = React.useState(false);
  const [isCallActive, setIsCallActive] = React.useState<boolean>(false);

  const mainScreenRef = React.useRef<HTMLVideoElement | null>(null);
  const localScreenRef = React.useRef<HTMLVideoElement | null>(null);

  const socketRef = React.useRef<Socket | null>(null);

  const connectionRef = React.useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = React.useRef<RTCDataChannel | null>(null);

  React.useEffect(() => {
    const handleGetUserMedia = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(localStream);
        initializePeerConnection(localStream);
        initializeSocket();
      } catch {
        addToast({
          title: "Media devices",
          description: "Please allow the media device to proceed with session",
          color: "warning",
          variant: "flat",
        });
      }
    };

    handleGetUserMedia();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (connectionRef.current) {
        connectionRef.current.close();
        setIsCallActive(false);
        // console.log("closed rtc connection");
      }
      if (dataChannelRef.current) {
        dataChannelRef.current.close();
      }
      if (localScreenRef.current) {
        localScreenRef.current.srcObject = null;
      }
    };
  }, []);

  React.useEffect(() => {
    if (mainScreenRef.current) {
      mainScreenRef.current.srcObject = remoteStream || localStream;
    }
  }, [localStream, remoteStream]);

  React.useEffect(() => {
    if (localScreenRef.current && localStream) {
      localScreenRef.current.srcObject = localStream;
    }
  }, [localStream, remoteStream]);

  React.useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [localStream]);

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(null);
    }
    setIsCallActive(false);
  };

  function initializeSocket() {
    const socket = io(import.meta.env.VITE_MEETING_SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      extraHeaders: {
        Authorization: `Bearer ${useAuthStore.getState().user.accessToken}`,
      },
    });

    socketRef.current = socket;

    socketRef.current.connect();

    socketRef.current.on("connect", () => {
      // console.log("Connected to socket");
      setupSocketListeners();
      socket.emit("join_session", { sessionId });
    });

    // socketRef.current.on("disconnect", () => {
    //   console.log("socket disconnected");
    // });
  }

  function setupSocketListeners() {
    // console.log("init listeners");
    if (!socketRef.current) return;

    socketRef.current.on("session_ready", () => {
      // console.log("session ready");
      setIsCallActive(true);
      if (useAuthStore.getState().user.role === "TUTOR") {
        initiateCall();
      }
    });

    socketRef.current.on("offer", handleOffer);

    socketRef.current.on("answer", handleAnswer);

    socketRef.current.on("ice_candidate", handleIceCandidates);
  }

  function toggleVideo() {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks()[0];

      if (videoTracks.enabled) {
        videoTracks.enabled = false;
      } else {
        videoTracks.enabled = true;
      }
      setIsVideoOff(!isVideoOff);
    }
  }

  function toggleAudio() {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks()[0];

      if (audioTracks.enabled) {
        audioTracks.enabled = false;
      } else {
        audioTracks.enabled = true;
      }
      setIsAudioOff(!isAudioOff);
    }
  }

  async function initiateCall() {
    // console.log("initiating call");

    if (connectionRef.current) {
      try {
        const offer = await connectionRef.current.createOffer();

        await connectionRef.current.setLocalDescription(offer);

        if (socketRef.current) {
          socketRef.current.emit("offer", {
            sessionId,
            offer,
          });
        }
      } catch (error) {
        console.error("Error creating offer", error);
      }
    }
  }

  async function handleAnswer({
    answer,
  }: {
    answer: RTCSessionDescriptionInit;
  }) {
    // console.log("answer recieved", answer);
    try {
      await connectionRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
    } catch (error) {
      console.error("Error handling answer", error);
    }
  }

  async function handleOffer({ offer }: { offer: RTCSessionDescriptionInit }) {
    // console.log("offer recieved", offer);

    try {
      await connectionRef.current?.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      const answer = await connectionRef.current?.createAnswer();

      await connectionRef.current?.setLocalDescription(answer);
      // console.log("sending answer");
      socketRef.current?.emit("answer", { sessionId, answer });
    } catch (error) {
      console.error("Error handling offer", error);
    }
  }

  async function handleIceCandidates({
    candidate,
  }: {
    candidate: RTCIceCandidate;
  }) {
    try {
      if (candidate) {
        await connectionRef.current?.addIceCandidate(
          new RTCIceCandidate(candidate),
        );
      }
    } catch (error) {
      console.error("Error adding ice candidates", error);
    }
  }

  function initializePeerConnection(localStream: MediaStream) {
    // console.log("creating peer connection");
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ],
    });

    const dataChannel = pc.createDataChannel("chat");

    // dataChannel.onopen = () => {
    //   console.log("data channel opened");
    // };

    dataChannelRef.current = dataChannel;

    dataChannel.onmessage = handleIncomingMessage;

    pc.ondatachannel = (e) => {
      dataChannelRef.current = e.channel;
    };

    pc.ontrack = ({ streams }) => {
      // if (localScreenRef.current) {
      //   localScreenRef.current.srcObject = streams[0];
      // }
      const stream = streams[0];

      if (stream) {
        setRemoteStream(stream);
      }
    };

    pc.onicecandidate = (event) => {
      // console.log("got ice candidates", event.candidate);
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice_candidate", {
          sessionId,
          candidate: event.candidate,
        });
      }
    };

    pc.onnegotiationneeded = () => {
      // console.log("negotiation needed");
      if (useAuthStore.getState().user.role === "TUTOR") {
        if (localStream) {
          initiateCall();
        }
      }
    };

    connectionRef.current = pc;

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });
  }

  function handleIncomingMessage(event: MessageEvent<string>) {
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: event.data, date: new Date(), type: "received" },
    ]);
  }

  function sendMessage(message: string) {
    if (dataChannelRef.current?.readyState === "open") {
      dataChannelRef.current.send(message);

      setMessages((prevMessages) => [
        ...prevMessages,
        { message, date: new Date(), type: "sent" },
      ]);
    }
  }

  // console.log(connectionRef.current?.iceGatheringState);

  return (
    <MeetingContext.Provider
      value={{
        mainScreenRef,
        localScreenRef,
        localStream,
        remoteStream,
        isCallActive,
        isAudioOff,
        isVideoOff,
        toggleAudio,
        toggleVideo,
        endCall,
        setLocalStream,
        messages,
        sendMessage,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
