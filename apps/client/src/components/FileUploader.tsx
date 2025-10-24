import { Card, CardBody } from "@heroui/card";
import React from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { addToast } from "@heroui/toast";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Image } from "@heroui/image";
import { Progress } from "@heroui/progress";

import CloseBoldIcon from "@/components/icons/CloseBoldIcon";
import UploadIcon from "@/components/icons/UploadIcon";
import { getUploadCredentials } from "@/services/upload";

import ImageCropper from "./ImageCropper";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string | null;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
  showCropper: boolean;
}

interface UploaderProps {
  acceptedFileType: "image" | "video";
  maxSize: number;
  maxFiles: number;
  enableMultipleFile?: boolean;
  onSuccess: (
    fileKey: string,
    resourceType: "video" | "image",
    uuid: string,
  ) => void;
  value: string | null;
  targetWidth?: number;
  targetHeight?: number;
}

export default function FileUploader({
  acceptedFileType,
  maxFiles,
  maxSize,
  value,
  enableMultipleFile,
  onSuccess,
  targetWidth,
  targetHeight,
}: UploaderProps) {
  const accept: Record<string, any> =
    acceptedFileType === "image" ? { "image/*": [] } : { "video/mp4": [] };

  const [fileState, setFileState] = React.useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    key: value ?? null,
    fileType: acceptedFileType,
    objectUrl: value ?? undefined,
    showCropper: false,
  });

  const checkDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();

      img.src = URL.createObjectURL(file);

      img.onload = () => {
        resolve(img.width === targetWidth && img.height === targetHeight);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(false);
      };
    });
  };

  const onDropCallback = React.useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        if (acceptedFileType === "image") {
          const dimensionsValid = await checkDimensions(file);

          if (!dimensionsValid) {
            setFileState((prev) => ({
              ...prev,
              file,
              objectUrl: URL.createObjectURL(file),
              id: uuidv4(),
              fileType: acceptedFileType,
              showCropper: true,
            }));

            return;
          }
        }

        setFileState((prev) => ({
          ...prev,
          file,
          objectUrl: URL.createObjectURL(file),
          id: uuidv4(),
          fileType: acceptedFileType,
        }));

        uploadFile(file);
      }
    },
    [fileState.objectUrl],
  );

  React.useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  async function uploadFile(file: File) {
    try {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
      }));

      const { formFields, uploadUrl } = await getUploadCredentials({
        fileName: file.name,
        resourceType: file.type.startsWith("image") ? "image" : "video",
      });

      const formData = new FormData();

      formData.append("file", file);

      for (let key in formFields) {
        if (Object.prototype.hasOwnProperty.call(formFields, key)) {
          formData.append(key, formFields[key]);
        }
      }

      const response = await axios.post(uploadUrl, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent && progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );

            setFileState((prev) => ({
              ...prev,
              progress: percent,
            }));
          }
        },
      });

      if (response.status === 200) {
        setFileState((prev) => ({ ...prev, uploading: false, progress: 0 }));
        onSuccess(
          `${response.data.public_id}.${response.data.format}`,
          response.data.resource_type,
          response.data.public_id,
        );
      }
    } catch {
      setFileState((prev) => ({
        ...prev,
        error: true,
        uploading: false,
        progress: 0,
      }));
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles,
    maxSize: maxSize ?? 5 * 1024 * 1024,
    onDrop: onDropCallback,
    accept,
    multiple: enableMultipleFile ?? false,
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || fileState.showCropper,
  });

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files",
      );

      if (tooManyFiles) {
        addToast({
          title: "Too many files",
          description: `You have selected multiple file`,
        });
      }

      const fileTooBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large",
      );

      if (fileTooBig) {
        addToast({
          title: "File too large",
          description: `Selected file is too large to upload. max files allowed is ${maxSize / (1024 * 1024)}MB.`,
        });
      }
    }
  }

  const handleCrop = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      setFileState((prev) => ({
        ...prev,
        showCropper: false,
        objectUrl: undefined,
        file: null,
      }));

      return;
    }
    canvas.toBlob((blob) => {
      if (blob && fileState.file) {
        const croppedFile = new File([blob], fileState.file.name, {
          type: fileState.file.type,
          lastModified: Date.now(),
        });

        setFileState((prev) => ({
          ...prev,
          file: croppedFile,
          objectUrl: URL.createObjectURL(croppedFile),
          showCropper: false,
        }));
        uploadFile(croppedFile);
      }
    }, fileState.file?.type || "image/jpeg");
  };

  function renderContent() {
    if (fileState.showCropper && fileState.objectUrl) {
      return (
        <ImageCropper
          selectionHeight={422}
          selectionWidth={750}
          src={fileState.objectUrl}
          onCrop={handleCrop}
        />
      );
    }
    if (fileState.uploading) {
      return (
        <Progress
          aria-label="Uploading..."
          className="max-w-28"
          showValueLabel={true}
          size="md"
          value={fileState.progress}
        />
      );
    }

    if (fileState.error) {
      return (
        <div className="flex flex-col items-center">
          <CloseBoldIcon className="text-red-500" width={32} />
          <p className="text-red-500">File upload failed.Please try again.</p>
        </div>
      );
    }

    if (fileState.objectUrl) {
      if (fileState.fileType === "image") {
        return <Image src={fileState.objectUrl} />;
      } else if (fileState.fileType === "video") {
        return (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video controls className="rounded-md" src={fileState.objectUrl} />
        );
      }
    }

    return (
      <>
        <UploadIcon className="text-default-500" width={28} />
        <p className="text-sm">
          <span className="underline">Click to upload</span> or drag and drop
        </p>
        <small className="text-default-500">
          Maximum file size {maxSize / (1024 * 1024)}MB.
        </small>
      </>
    );
  }

  return (
    <div {...getRootProps()}>
      <input accept="image/jpeg, image/jpg, image/png" {...getInputProps()} />
      <Card
        className={`border border-default-${isDragActive ? "500" : "200"} w-full min-h-40`}
        shadow="none"
      >
        <CardBody className="flex justify-center items-center">
          {renderContent()}
        </CardBody>
      </Card>
    </div>
  );
}
