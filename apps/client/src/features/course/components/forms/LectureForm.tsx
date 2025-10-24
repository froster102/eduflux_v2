import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import React from "react";

import { lectureSchema } from "@/features/course/schemas/course";
import FileUploader from "@/components/FileUploader";
import HLSPlayer from "@/components/HLSPlayer";

export default function LectureForm({
  onSubmitHandler,
  isPending,
  mode,
  initialValue,
  onCancel,
  onContentUploadHander,
  previewContent,
  previewContentSrc,
}: DefaultFormProps<LectureFormData> & {
  showFileUploader?: boolean;
  previewContent?: boolean;
  previewContentSrc?: {
    type: string;
    src: string;
  } | null;
  onContentUploadHander: (
    key: string,
    resourseType: "image" | "video",
    uuid: string,
  ) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LectureFormData>({
    resolver: zodResolver(lectureSchema),
    defaultValues: mode === "edit" ? initialValue : {},
  });
  const [updateContent, setUpdateContent] = React.useState(false);

  return (
    <Form
      className="pt-0 flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <Input
        {...register("title")}
        errorMessage={errors.title?.message}
        isInvalid={!!errors.title}
        label="Title"
        labelPlacement="outside"
        name="title"
        placeholder="Enter lecture title"
        type="text"
        variant="faded"
      />
      <Textarea
        {...register("description")}
        disableAutosize={false}
        errorMessage={errors.description?.message}
        isInvalid={!!errors.description}
        label="Description"
        labelPlacement="outside"
        placeholder="What is this lecture about"
        variant="faded"
      />
      {!updateContent ? (
        previewContent &&
        previewContentSrc && (
          <>
            <div className="w-full flex flex-col gap-2 rounded-md overflow-hidden">
              <HLSPlayer
                options={{
                  autoplay: true,
                  controls: true,
                  responsive: true,
                  sources: [
                    {
                      type: previewContentSrc.type,
                      src: previewContentSrc.src,
                    },
                  ],
                }}
              />
              <Button
                className="ml-auto"
                color="primary"
                size="sm"
                onPress={() => setUpdateContent(true)}
              >
                Update content
              </Button>
            </div>
          </>
        )
      ) : (
        <div className="w-full">
          <p className="text-sm pb-2">Upload your video</p>
          <FileUploader
            acceptedFileType="video"
            maxFiles={1}
            maxSize={1024 * 1024 * 1024}
            value={null}
            onSuccess={onContentUploadHander}
          />
        </div>
      )}
      <Controller
        control={control}
        name="preview"
        render={({ field }) => (
          <div>
            {errors.preview && (
              <p className="text-xs text-red-700">{errors.preview.message}</p>
            )}
            <Switch
              className="pt-2"
              isSelected={field.value ?? false}
              onValueChange={field.onChange}
            >
              Preview
            </Switch>
          </div>
        )}
      />
      <div className="ml-auto">
        <Button color="danger" variant="flat" onPress={onCancel}>
          Close
        </Button>
        <Button
          className="ml-2"
          color="primary"
          isDisabled={isPending || !isDirty}
          isLoading={isPending}
          type="submit"
        >
          Create
        </Button>
      </div>
    </Form>
  );
}
