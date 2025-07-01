import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";

import { lectureSchema } from "@/validations/course";
import FileUploader from "@/components/FileUploader";

export default function LectureForm({
  onSubmitHandler,
  isPending,
  mode,
  initialValue,
  showFileUploader,
  onCancel,
}: DefaultFormProps<LectureFormData> & { showFileUploader?: boolean }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LectureFormData>({
    resolver: zodResolver(lectureSchema),
    defaultValues: mode === "edit" ? initialValue : {},
  });

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
      />
      <Textarea
        {...register("description")}
        disableAutosize={false}
        errorMessage={errors.description?.message}
        isInvalid={!!errors.description}
        label="Description"
        labelPlacement="outside"
        placeholder="What is this lecture about"
      />
      {showFileUploader && (
        <div className="w-full">
          <p className="text-sm pb-2">Upload your video</p>
          <FileUploader
            acceptedFileType="video"
            maxFiles={1}
            maxSize={1024 * 1024 * 1024}
            value={null}
            onSuccess={() => {}}
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
          isDisabled={isPending}
          isLoading={isPending}
          type="submit"
        >
          Create
        </Button>
      </div>
    </Form>
  );
}
