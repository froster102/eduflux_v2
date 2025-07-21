import { Input, Textarea } from "@heroui/input";
import { Controller, useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import React from "react";
import { Button } from "@heroui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@heroui/avatar";
import axios from "axios";
import { Progress } from "@heroui/progress";

import { updateProfileSchema } from "../../validations/account-schema";

import { formatTo12HourWithDate } from "@/utils/date";
import EditIcon from "@/assets/icons/EditIcon";
import UploadIcon from "@/assets/icons/UploadIcon";
import { IMAGE_BASE_URL } from "@/config/image";
import { getUploadCredentials } from "@/features/instructor/courses/services/course";

interface ProfileImageUploadState {
  isUploading: boolean;
  isError: boolean;
  progress: number;
}

export default function ProfileForm({
  initialValue,
  onSubmitHandler,
}: DefaultFormProps<Partial<UserProfile>>) {
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<Partial<UserProfile>>({
    defaultValues: initialValue,
    resolver: zodResolver(updateProfileSchema),
  });
  const [action, setAction] = React.useState<"edit" | "view">("view");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [profileImageUploadState, setProfileImageUploadState] =
    React.useState<ProfileImageUploadState>({
      isError: false,
      isUploading: false,
      progress: 0,
    });

  const onSubmit = (data: Partial<UserProfile>) => {
    onSubmitHandler(data);
    reset(data);
    setAction("view");
  };

  function handleProfileImageUpdateClick() {
    setAction("edit");
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      const fileKey = await uploadFile(file);

      setValue("image", fileKey, { shouldDirty: true });
    }
  }

  async function uploadFile(file: File) {
    try {
      setProfileImageUploadState((prev) => ({
        ...prev,
        isUploading: true,
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

            setProfileImageUploadState((prev) => ({
              ...prev,
              progress: percent,
            }));
          }
        },
      });

      if (response.status === 200) {
        setProfileImageUploadState((prev) => ({
          ...prev,
          isUploading: false,
          progress: 0,
        }));

        const fileKey = `${response.data.public_id}.${response.data.format}`;

        return fileKey;
      }
    } catch {
      setProfileImageUploadState((prev) => ({
        ...prev,
        error: true,
        uploading: false,
        progress: 0,
      }));
    }
  }

  return (
    <Form
      className="w-full relative flex flex-col gap-4 pt-4"
      validationBehavior="native"
      onSubmit={handleSubmit(onSubmit)}
    >
      {action === "view" && (
        <Button
          isIconOnly
          className="absolute right-0 bg-transparent border border-default-200"
          size="sm"
          onPress={() => {
            setAction("edit");
          }}
        >
          <EditIcon width={24} />
        </Button>
      )}
      <div className="flex items-center gap-4">
        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <Avatar
              className="w-20 h-20 text-large"
              src={`${IMAGE_BASE_URL}${field.value}`}
            />
          )}
        />

        <input
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          type="file"
          onChange={handleFileChange}
        />

        {profileImageUploadState.isUploading ? (
          <Progress
            aria-label="Profile image uploading..."
            value={profileImageUploadState.progress}
          />
        ) : (
          <Button
            size="sm"
            startContent={<UploadIcon width={14} />}
            variant="ghost"
            onPress={handleProfileImageUpdateClick}
          >
            Update image
          </Button>
        )}
      </div>
      <div className="flex w-full gap-4">
        <Controller
          control={control}
          name={"firstName"}
          render={({ field }) => (
            <Input
              {...field}
              color="default"
              errorMessage={errors.firstName?.message}
              isInvalid={!!errors.firstName}
              label="First Name"
              labelPlacement="outside"
              name="firstName"
              radius="sm"
              readOnly={action === "view"}
            />
          )}
        />
      </div>
      <Controller
        control={control}
        name="lastName"
        render={({ field }) => (
          <Input
            {...field}
            errorMessage={errors.lastName?.message}
            isInvalid={!!errors.lastName}
            label="Last Name"
            labelPlacement="outside"
            name="email"
            radius="sm"
            readOnly={action === "view"}
            type="text"
          />
        )}
      />
      <Controller
        control={control}
        name="bio"
        render={({ field }) => (
          <Textarea
            readOnly={action === "view"}
            {...field}
            label="Biography"
            labelPlacement="outside"
          />
        )}
      />

      <div className="w-full flex flex-col gap-4">
        <div className="flex gap-4">
          <Input
            label="Created on"
            labelPlacement="outside"
            name="Created on"
            radius="sm"
            readOnly={true}
            type="text"
            value={
              (initialValue?.createdAt &&
                formatTo12HourWithDate(new Date(initialValue.createdAt))) ||
              ""
            }
          />
          <Input
            label="Updated on"
            labelPlacement="outside"
            name="Updated on"
            radius="sm"
            readOnly={true}
            type="text"
            value={
              (initialValue?.updatedAt &&
                formatTo12HourWithDate(new Date(initialValue.updatedAt))) ||
              ""
            }
          />
        </div>
      </div>
      {action === "edit" && (
        <div className="ml-auto">
          <Button
            color="danger"
            size="sm"
            type="reset"
            variant="flat"
            onPress={() => {
              setAction("view");
              reset(initialValue);
            }}
          >
            Cancel
          </Button>
          <Button
            className="ml-2"
            color="primary"
            isDisabled={!isDirty}
            size="sm"
            type="submit"
          >
            Update Profile
          </Button>
        </div>
      )}
    </Form>
  );
}
