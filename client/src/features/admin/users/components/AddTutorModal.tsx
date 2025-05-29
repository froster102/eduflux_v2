import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { PlusIcon } from "lucide-react";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectItem } from "@heroui/select";
import { Form } from "@heroui/form";

import { useCreateTutorMutation } from "../hooks/mutations";
import { createTutorSchema } from "../validations/add-tutor-schema";
import { useGetAllCoursesQuery } from "../../courses/hooks/queries";
import { CreateTutorData } from "../types/types";

export default function AddTutorModal({
  openAddForm,
  onClose,
}: {
  openAddForm: boolean;
  onClose: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchQuery] = React.useState("");
  const [searchKey] = React.useState("title");
  const [page] = React.useState(1);
  const [pageSize] = React.useState(10);
  const { data: coursesData, isLoading } = useGetAllCoursesQuery({
    page,
    pageSize,
    searchKey,
    searchQuery,
  });
  const addTutorMutation = useCreateTutorMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateTutorData>({
    resolver: zodResolver(createTutorSchema),
  });

  React.useEffect(() => {
    if (openAddForm) {
      onOpen();
    }
  }, [openAddForm]);

  const handleModalClose = () => {
    onClose();
    onOpenChange();
  };

  const onSubmit: SubmitHandler<CreateTutorData> = (data) => {
    addTutorMutation.mutate(data);
    !addTutorMutation.isPending && handleModalClose();
  };

  return (
    <Modal
      backdrop="blur"
      classNames={{
        base: "dark:bg-secondary-700 bg-secondary-500",
        backdrop: "bg-secondary-600/10",
      }}
      isOpen={isOpen}
      onOpenChange={handleModalClose}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Add Tutor</ModalHeader>
            <ModalBody className="item-center justify-center px-6 pb-6">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  {...register("firstName")}
                  errorMessage={errors.firstName?.message}
                  isInvalid={!!errors.firstName}
                  label="First Name"
                  labelPlacement="outside"
                  name="firstName"
                  placeholder="Enter tutor first name"
                  type="text"
                />
                <Input
                  {...register("lastName")}
                  className="pt-4"
                  errorMessage={errors.lastName?.message}
                  isInvalid={!!errors.lastName}
                  label="Last Name"
                  labelPlacement="outside"
                  name="lastName"
                  placeholder="Enter tutor last name"
                  type="text"
                />
                <Input
                  {...register("email")}
                  className="pt-4"
                  errorMessage={errors.email?.message}
                  isInvalid={!!errors.email}
                  label="Email"
                  labelPlacement="outside"
                  name="email"
                  placeholder="Enter tutor email"
                  type="text"
                />
                <Input
                  {...register("contactNumber")}
                  className="pt-4"
                  errorMessage={errors.contactNumber?.message}
                  isInvalid={!!errors.contactNumber}
                  label="Contact Number"
                  labelPlacement="outside"
                  name="contactNumber"
                  placeholder="Enter tutor contact number"
                  type="text"
                />
                <Controller
                  control={control}
                  name="courses"
                  render={({ field }) => (
                    <Select
                      className="pt-4"
                      errorMessage={errors.courses?.message}
                      isInvalid={!!errors.courses}
                      label="Courses"
                      labelPlacement="outside"
                      placeholder="Select tutor courses"
                      selectionMode="multiple"
                      onSelectionChange={(value) => {
                        field.onChange(Array.from(value));
                      }}
                    >
                      {isLoading ? (
                        <SelectItem>Loading...</SelectItem>
                      ) : (
                        (coursesData?.courses || []).map((course) => (
                          <SelectItem key={course.id}>
                            {course.title}
                          </SelectItem>
                        ))
                      )}
                    </Select>
                  )}
                />
                <div className="pt-4">
                  <Button
                    className="dark:text-background"
                    color="primary"
                    isLoading={addTutorMutation.isPending}
                    type="submit"
                  >
                    Create <PlusIcon />
                  </Button>
                </div>
              </Form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
