import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { DatePicker } from "@heroui/date-picker";
import { TimeInput } from "@heroui/date-input";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Avatar } from "@heroui/avatar";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, today } from "@internationalized/date";
import React from "react";

import { CreateSessionFormData } from "@/features/instructor/types/types";
import { sessionFormSchema } from "@/features/instructor/validation/session-form-schema";

interface SessionFormProps {
  students: Student[];
  isStudentLoading: boolean;
  onSubmitHandler: (createSessionFormData: CreateSessionFormData) => void;
}

export default function SessionForm({
  students,
  isStudentLoading,
  onSubmitHandler,
}: SessionFormProps) {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<CreateSessionFormData>({
    resolver: zodResolver(sessionFormSchema),
  });

  const formRef = React.useRef<HTMLFormElement>(null);

  function onSubmit(createSessionFormData: CreateSessionFormData) {
    onSubmitHandler(createSessionFormData);
    reset();
    formRef.current?.reset();
  }

  return (
    <>
      <Form
        ref={formRef}
        className="w-full flex flex-col gap-4 "
        validationBehavior="native"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="selectedDate"
          render={({ field: { onChange } }) => {
            return (
              <DatePicker
                defaultValue={today(getLocalTimeZone())}
                errorMessage={errors.selectedDate?.message}
                isInvalid={!!errors.selectedDate}
                label="Please select the session date"
                labelPlacement="outside"
                minValue={today(getLocalTimeZone())}
                variant="flat"
                onChange={(value) => {
                  onChange(value?.toDate("UTC").toISOString());
                }}
              />
            );
          }}
        />

        <Controller
          control={control}
          name="startTime"
          render={({ field }) => {
            return (
              <TimeInput
                errorMessage={errors.startTime?.message}
                isInvalid={!!errors.startTime}
                label="Enter the session start time"
                labelPlacement="outside"
                onChange={(value) => {
                  field.onChange(value?.toString());
                }}
              />
            );
          }}
        />

        <Controller
          control={control}
          name="endTime"
          render={({ field }) => {
            return (
              <TimeInput
                errorMessage={errors.endTime?.message}
                isInvalid={!!errors.endTime}
                label="Enter the session end time"
                labelPlacement="outside"
                onChange={(value) => {
                  field.onChange(value?.toString());
                }}
              />
            );
          }}
        />

        <Controller
          control={control}
          name="studentId"
          render={({ field }) => {
            return (
              <Autocomplete
                aria-label="Select a student"
                defaultItems={students || []}
                errorMessage={errors.studentId?.message}
                isInvalid={!!errors.studentId}
                isLoading={isStudentLoading}
                label="Select an student"
                labelPlacement="outside"
                listboxProps={{
                  hideSelectedIcon: true,
                  itemClasses: {
                    base: [
                      "rounded-medium",
                      "text-default-500",
                      "transition-opacity",
                      "data-[hover=true]:text-foreground",
                      "dark:data-[hover=true]:bg-default-50",
                      "data-[pressed=true]:opacity-70",
                      "data-[hover=true]:bg-default-200",
                      "data-[selectable=true]:focus:bg-default-100",
                      "data-[focus-visible=true]:ring-default-500",
                    ],
                  },
                }}
                placeholder="Enter student email"
                popoverProps={{
                  offset: 10,
                  classNames: {
                    base: "rounded-large",
                    content:
                      "p-1 border-small border-default-100 bg-background",
                  },
                }}
                variant="flat"
                onSelectionChange={(key) => {
                  if (key) {
                    field.onChange(key);
                  }
                }}
              >
                {(item: Student) => (
                  <AutocompleteItem
                    key={item.user?.id}
                    textValue={item.user?.firstName + " " + item.user?.lastName}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <Avatar
                          // alt={item.name}
                          className="flex-shrink-0"
                          size="sm"
                          // src={item.avatar}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">
                            {item.user?.firstName + " " + item.user?.lastName}
                          </span>
                          <span className="text-tiny text-default-400">
                            {item.user?.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </AutocompleteItem>
                )}
              </Autocomplete>
            );
          }}
        />
        <Button
          color="primary"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          size="sm"
          type="submit"
        >
          Schedule
        </Button>
      </Form>
    </>
  );
}
