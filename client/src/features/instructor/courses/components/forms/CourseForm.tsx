import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Controller, useForm } from "react-hook-form";
import { DollarSign } from "lucide-react";
import { NumberInput } from "@heroui/number-input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

import { useGetCourseCategories } from "../../hooks/queries";

import Uploader from "@/components/FileUploader";
import { updateCourseSchema } from "@/validations/course";
import RichTextEditor from "@/components/text-editor/RichTextEditor";
import { IMAGE_BASE_URL } from "@/config/image";

export default function CourseForm({
  onSubmitHandler,
  initialValues,
  onPublishHandler,
  isPublishing,
  isPublished,
}: DefaultFormProps<UpdateCourseFormData> & {
  initialValues: Partial<UpdateCourseFormData>;
  onPublishHandler: () => void;
  isPublishing: boolean;
  isPublished: boolean;
}) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty },
    control,
  } = useForm<UpdateCourseFormData>({
    defaultValues: initialValues,
    resolver: zodResolver(updateCourseSchema),
  });
  const { data: courseCategories, isLoading: isCourseCategoriesLoading } =
    useGetCourseCategories();

  React.useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <Form
      className="h-full w-full min-w-[224px] flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <div className="w-full">
        <Input
          {...register("title")}
          errorMessage={errors.title?.message}
          isInvalid={!!errors.title}
          label="Title"
          labelPlacement="outside"
          name="title"
          placeholder="Enter your course title"
          type="text"
        />
      </div>
      <div className="w-full">
        <Controller
          control={control}
          name="level"
          render={({ field }) => (
            <Select
              errorMessage={errors.level?.message}
              isInvalid={!!errors.level}
              label="Level"
              labelPlacement="outside"
              placeholder="Select level of the course"
              selectedKeys={new Set([field.value as string])}
              onSelectionChange={(value) => {
                field.onChange(value.anchorKey);
              }}
            >
              <SelectItem key={"beginner"}>Beginner</SelectItem>
              <SelectItem key={"intermediate"}>Intermediate</SelectItem>
              <SelectItem key={"advanced"}>Advanced</SelectItem>
            </Select>
          )}
        />
      </div>
      <div className="w-full">
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <>
              <p className="text-sm pb-2">Description</p>
              <RichTextEditor
                value={field.value ?? ""}
                onValueChange={field.onChange}
              />
            </>
          )}
        />
      </div>
      <div className="flex w-full gap-4">
        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <NumberInput
              hideStepper
              aria-label="Course Price"
              errorMessage={errors.price?.message}
              isInvalid={!!errors.price}
              label="Pricing"
              labelPlacement="outside"
              placeholder="Enter course the price"
              startContent={
                <DollarSign className="text-default-500" width={16} />
              }
              value={Number(field.value)}
              onChange={(e) => {
                field.onChange(Number((e as any).target.value));
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              errorMessage={errors.categoryId?.message}
              isInvalid={!!errors.categoryId}
              isLoading={isCourseCategoriesLoading}
              label="Category"
              labelPlacement="outside"
              placeholder="Select course category"
              selectedKeys={new Set([field.value as string])}
              onSelectionChange={(value) => {
                field.onChange(value.anchorKey);
              }}
            >
              {courseCategories && courseCategories.categories
                ? courseCategories.categories.map((category) => (
                    <SelectItem key={category.id}>{category.title}</SelectItem>
                  ))
                : []}
            </Select>
          )}
        />
      </div>

      <div className="max-w-md w-full">
        <p className="text-sm pb-2">Thumbnail</p>
        <Controller
          control={control}
          name={"thumbnail"}
          render={({ field }) => (
            <Uploader
              acceptedFileType="image"
              maxFiles={1}
              maxSize={5 * 1024 * 1024}
              value={field.value ? `${IMAGE_BASE_URL}/${field.value}` : null}
              onSuccess={field.onChange}
            />
          )}
        />
        {/* <div className="pt-4">
            <ResourcePreview resourceType="image" src={watch("thumbnail")} />
          </div> */}
      </div>
      <div className="flex gap-2">
        <Button color="primary" isDisabled={!isDirty} type="submit">
          Save
        </Button>
        {!isPublished && (
          <Button
            color="primary"
            isDisabled={isPublishing}
            isLoading={isPublishing}
            onPress={onPublishHandler}
          >
            Publish
          </Button>
        )}
      </div>
    </Form>
  );
}
