import { Image } from "@heroui/image";
import { Card, CardBody } from "@heroui/card";

import VideoPlayer from "@/components/VideoPlayer";

interface ResourcePreviewProps {
  resourceType: "video" | "pdf" | "src" | "image";
  src: string | File;
}

export default function ResourcePreview({
  resourceType,
  src,
}: ResourcePreviewProps) {
  if (resourceType === "video") {
    if (src instanceof File) {
      return (
        <div className="pt-2">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            key={src.name}
            controls
            className="h-full max-w-[384px] w-full rounded-lg"
          >
            <source src={URL.createObjectURL(src)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="text-sm text-gray-500">Selected file: {src.name}</p>
        </div>
      );
    } else if (typeof src === "string") {
      return (
        <div className="max-w-sm w-full">
          <Card
            className="bg-background w-full h-auto"
            radius="sm"
            shadow="none"
          >
            <CardBody className="p-0">
              <div>
                <VideoPlayer videoId={src.split("/")[4]} />
              </div>
            </CardBody>
          </Card>
        </div>
      );
    }
  }

  if (resourceType === "pdf") {
    if (src instanceof File) {
      return (
        <div className="pt-2">
          <p className="text-sm text-gray-500">Selected file: {src.name}</p>
        </div>
      );
    } else if (typeof src === "string") {
      return (
        <div className="pt-2">
          <iframe height="400px" src={src} title="PDF Preview" width="100%" />
        </div>
      );
    }
  }

  if (resourceType === "image") {
    if (src instanceof File) {
      return <Image height={324} src={URL.createObjectURL(src)} width={324} />;
    }
    if (typeof src === "string") {
      return <Image height={324} src={src} width={324} />;
    }
  }

  return <p>No preview available</p>;
}
