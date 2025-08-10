import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";

import { useGetCourseCategories } from "../../hooks/useGetCourseCategories";

import { createCourseSchema } from "@/validations/course";

export default function CreateCourseForm({
  onSubmitHandler,
  isPending,
  mode,
  onCancel,
  initialValue,
}: DefaultFormProps<CreateCourseFormData>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: mode === "edit" ? initialValue : {},
  });

  const { data, isLoading } = useGetCourseCategories();

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
        placeholder="Enter your course title"
        type="text"
        variant="faded"
      />

      <Controller
        control={control}
        name="categoryId"
        render={({ field }) => (
          <Select
            className="pt-4"
            errorMessage={errors.categoryId?.message}
            isInvalid={!!errors.categoryId}
            isLoading={isLoading}
            label="Category"
            labelPlacement="outside"
            placeholder="Select category of the course"
            selectedKeys={new Set([field.value])}
            variant="faded"
            onSelectionChange={(value) => {
              field.onChange(value.anchorKey);
            }}
          >
            {data
              ? data.categories.map((category) => (
                  <SelectItem key={category.id}>{category.title}</SelectItem>
                ))
              : []}
          </Select>
        )}
      />
      <div className="flex py-2 px-1 justify-between" />
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
