import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Controller, useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";

import { useGetCourseCategories } from "../hooks/useGetCourseCategories";
import { useCreateCourse } from "../hooks/useCreateCourse";

import { createCourseSchema } from "@/validations/course";

export default function CreateCourseModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  isEditing?: boolean;
  onClose: () => void;
}) {
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
  });

  const { data, isLoading } = useGetCourseCategories();

  const createCourse = useCreateCourse();

  function onSubmit(data: CreateCourseFormData) {
    createCourse.mutate(data);
    onClose();
  }

  return (
    <>
      <Modal
        backdrop="blur"
        className="dark:bg-secondary-700 bg-secondary-400"
        classNames={{
          backdrop: "bg-secondary-600/10",
        }}
        isOpen={isOpen}
        placement="top-center"
        scrollBehavior="inside"
        onClose={() => reset()}
        onOpenChange={() => onClose()}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Course
              </ModalHeader>
              <ModalBody>
                <Form
                  className="pt-0 flex flex-col gap-4"
                  onSubmit={handleSubmit(onSubmit)}
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
                        onSelectionChange={(value) => {
                          field.onChange(value.anchorKey);
                        }}
                      >
                        {data
                          ? data.categories.map((category) => (
                              <SelectItem key={category.id}>
                                {category.title}
                              </SelectItem>
                            ))
                          : []}
                      </Select>
                    )}
                  />
                  <div className="flex py-2 px-1 justify-between" />
                  <div className="ml-auto">
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      className="ml-2"
                      color="primary"
                      isDisabled={createCourse.isPending}
                      isLoading={createCourse.isPending}
                      type="submit"
                    >
                      Create
                    </Button>
                  </div>
                </Form>
              </ModalBody>
              <ModalFooter />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
