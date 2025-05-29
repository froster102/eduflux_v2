import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { Edit } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import React from "react";
import { Button } from "@heroui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateProfileSchema } from "../validations/update-profile";

import { formatTo12HourWithDate } from "@/utils/date";

interface ProfileFormProps {
  initialValues: User;
  onSubmitHandler: (data: any) => void;
}

interface ProfileFormData {
  email: string;
  lastName: string;
  firstName: string;
  contactNumber: string;
  address: string;
}

export default function ProfileForm({
  initialValues,
  onSubmitHandler,
}: ProfileFormProps) {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: initialValues,
    resolver: zodResolver(updateProfileSchema),
  });
  const [action, setAction] = React.useState<"edit" | "view">("view");

  const onSubmit: SubmitHandler<ProfileFormData> = (formData) => {
    onSubmitHandler(formData);
    reset(formData);

    setAction("view");
  };

  return (
    <Card className="bg-background w-full h-fit p-2" radius="sm" shadow="sm">
      <CardHeader className="flex justify-between">
        <p className="font-medium">Profile</p>
        {action === "view" && (
          <Edit
            onClick={() => {
              setAction("edit");
            }}
          />
        )}
      </CardHeader>
      <Divider className="" orientation="horizontal" />
      <CardBody>
        <div />
        <Form
          className="w-full flex flex-col gap-4 pt-4"
          validationBehavior="native"
          onSubmit={handleSubmit(onSubmit)}
        >
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
                  placeholder="First name"
                  radius="sm"
                  readOnly={action === "view"}
                />
              )}
            />
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
                  name="lastName"
                  placeholder="Last name"
                  radius="sm"
                  readOnly={action === "view"}
                  type="text"
                />
              )}
            />
          </div>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                {...field}
                errorMessage={errors.email?.message}
                isInvalid={!!errors.email}
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="Email"
                radius="sm"
                readOnly={action === "view"}
                type="text"
              />
            )}
          />
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <Input
                {...field}
                errorMessage={errors.address?.message}
                isInvalid={!!errors.address}
                label="Address"
                labelPlacement="outside"
                name="address"
                placeholder="Address"
                radius="sm"
                readOnly={action === "view"}
                type="text"
              />
            )}
          />
          <Controller
            control={control}
            name="contactNumber"
            render={({ field }) => (
              <Input
                {...field}
                errorMessage={errors.contactNumber?.message}
                isInvalid={!!errors.contactNumber}
                label="Contact Number"
                labelPlacement="outside"
                name="email"
                placeholder="Contact Number"
                radius="sm"
                readOnly={action === "view"}
                type="text"
              />
            )}
          />

          <div className="w-full flex flex-col gap-4">
            <div className="flex gap-4">
              <Input
                label="Created on"
                labelPlacement="outside"
                name="Created on"
                placeholder="Created on"
                radius="sm"
                readOnly={true}
                type="text"
                value={
                  (initialValues?.createdAt &&
                    formatTo12HourWithDate(
                      new Date(initialValues.createdAt),
                    )) ||
                  ""
                }
              />
              <Input
                label="Updated on"
                labelPlacement="outside"
                name="Updated on"
                placeholder="Updated on"
                radius="sm"
                readOnly={true}
                type="text"
                value={
                  (initialValues?.updatedAt &&
                    formatTo12HourWithDate(
                      new Date(initialValues.updatedAt),
                    )) ||
                  ""
                }
              />
            </div>
          </div>
          {action === "edit" && (
            <div className="ml-auto">
              <Button
                color="primary"
                size="sm"
                type="reset"
                onPress={() => {
                  setAction("view");
                  reset(initialValues);
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
      </CardBody>
    </Card>
  );
}
