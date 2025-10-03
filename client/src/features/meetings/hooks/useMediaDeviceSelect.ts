import {
  useMaybeRoomContext,
  UseMediaDeviceSelectProps,
} from "@livekit/components-react";
import { Room } from "livekit-client";
import React from "react";

/**
 * The `useMediaDeviceSelect` hook is used to implement the `MediaDeviceSelect` component and
 * returns o.a. the list of devices of a given kind (audioinput or videoinput), the currently active device
 * and a function to set the the active device.
 *
 * @example
 * ```tsx
 * const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({kind: 'audioinput'});
 * ```
 * @public
 */
export function useMediaDeviceSelect({
  kind,
  room,
  track,
  requestPermissions,
  onError,
}: UseMediaDeviceSelectProps) {
  const roomContext = useMaybeRoomContext();

  const roomFallback = React.useMemo(
    () => room ?? roomContext ?? new Room(),
    [room, roomContext],
  );

  // List of all devices.
  const deviceObserver = React.useMemo(
    () => createMediaDeviceObserver(kind, onError, requestPermissions),
    [kind, requestPermissions, onError],
  );
  const devices = useObservableState(deviceObserver, [] as MediaDeviceInfo[]);
  // Active device management.
  const [currentDeviceId, setCurrentDeviceId] = React.useState<string>(
    roomFallback?.getActiveDevice(kind) ?? "default",
  );
  const { className, activeDeviceObservable, setActiveMediaDevice } =
    React.useMemo(
      () => setupDeviceSelector(kind, roomFallback),
      [kind, roomFallback, track],
    );

  React.useEffect(() => {
    const listener = activeDeviceObservable.subscribe((deviceId) => {
      if (!deviceId) {
        return;
      }
      log.info("setCurrentDeviceId", deviceId);
      setCurrentDeviceId(deviceId);
    });

    return () => {
      listener?.unsubscribe();
    };
  }, [activeDeviceObservable]);

  return {
    devices,
    className,
    activeDeviceId: currentDeviceId,
    setActiveMediaDevice,
  };
}
