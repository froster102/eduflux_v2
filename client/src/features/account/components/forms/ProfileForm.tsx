import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input, Textarea } from "@heroui/input";
import { Controller, useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import React from "react";
import { Button } from "@heroui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateProfileSchema } from "../../validations/account.schema";

import { formatTo12HourWithDate } from "@/utils/date";
import EditIcon from "@/assets/icons/EditIcon";

export default function ProfileForm({
  initialValue,
  onSubmitHandler,
}: DefaultFormProps<Partial<UserProfile>>) {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<Partial<UserProfile>>({
    defaultValues: initialValue,
    resolver: zodResolver(updateProfileSchema),
  });
  const [action, setAction] = React.useState<"edit" | "view">("view");

  const onSubmit = (data: Partial<UserProfile>) => {
    onSubmitHandler(data);

    setAction("view");
  };

  return (
    <Card className="bg-background w-full h-fit p-2" radius="sm" shadow="sm">
      <CardHeader className="flex justify-between">
        <p className="font-medium">Profile</p>
        {action === "view" && (
          <Button
            isIconOnly
            className="bg-transparent border border-default-200"
            size="sm"
            onPress={() => {
              setAction("edit");
            }}
          >
            <EditIcon width={24} />
          </Button>
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
      </CardBody>
    </Card>
  );
}
