import { TimeInput } from "@heroui/date-input";
import { Checkbox } from "@heroui/checkbox";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { NumberInput } from "@heroui/number-input";
import { parseTime } from "@internationalized/date";
import { Card, CardBody, CardHeader } from "@heroui/card";

import {
  AvailabilityFormData,
  availabilitySchema,
} from "../../validation/session-schema";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_START_TIME_STR = "10:00:00";
const DEFAULT_END_TIME_STR = "23:00:00";

const defaultScheduleSetting = {
  weeklySchedule: weekdays.map((_, index) => ({
    dayOfWeek: index,
    enabled: false,
    startTime: DEFAULT_START_TIME_STR,
    endTime: DEFAULT_END_TIME_STR,
  })),
  applyForWeeks: 1,
};

export default function ScheduleSettingForm({
  initialValue,
  isPending,
  onSubmitHandler,
}: DefaultFormProps<AvailabilityFormData>) {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm<AvailabilityFormData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: initialValue || defaultScheduleSetting,
  });

  const watchedDays = watch("weeklySchedule");

  function onAvailabilitySubmit(data: AvailabilityFormData) {
    onSubmitHandler(data);
  }

  console.log(initialValue, defaultScheduleSetting);

  return (
    <Card className="bg-background w-full">
      <CardHeader>
        <p className="text-lg font-medium">Availablity</p>
      </CardHeader>
      <CardBody className="flex flex-col gap-2">
        <Form onSubmit={handleSubmit(onAvailabilitySubmit)}>
          {weekdays.map((day, index) => (
            <div key={day} className="flex w-full justify-between">
              <Controller
                control={control}
                name={`weeklySchedule.${index}.enabled`}
                render={({ field }) => (
                  <Checkbox
                    className="flex-shrink-0"
                    isSelected={field.value}
                    onValueChange={(checked) => {
                      field.onChange(checked);
                      if (!checked) {
                        setValue(
                          `weeklySchedule.${index}.startTime`,
                          undefined,
                        );
                        setValue(`weeklySchedule.${index}.endTime`, undefined);
                      }
                    }}
                  >
                    <span>{day}</span>
                  </Checkbox>
                )}
              />
              <div className="flex gap-2 justify-between w-fit">
                <Controller
                  control={control}
                  name={`weeklySchedule.${index}.startTime`}
                  render={({ field }) => (
                    <TimeInput
                      hideTimeZone
                      aria-label={`Start time for ${day}`}
                      className="focus-within:ring-2 rounded-lg focus-within:ring-primary-500"
                      errorMessage={
                        errors.weeklySchedule?.[index]?.startTime?.message
                      }
                      isDisabled={!watchedDays?.[index]?.enabled}
                      isInvalid={!!errors.weeklySchedule?.[index]?.startTime}
                      size="sm"
                      value={parseTime(field.value || DEFAULT_START_TIME_STR)}
                      onChange={(v) => field.onChange(v ? v.toString() : "")}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`weeklySchedule.${index}.endTime`}
                  render={({ field }) => (
                    <TimeInput
                      hideTimeZone
                      aria-label={`Start time for ${day}`}
                      className="focus-within:ring-2 rounded-lg focus-within:ring-primary-500"
                      errorMessage={
                        errors.weeklySchedule?.[index]?.endTime?.message
                      }
                      isDisabled={!watchedDays[index]?.enabled}
                      isInvalid={!!errors.weeklySchedule?.[index]?.endTime}
                      size="sm"
                      value={parseTime(field.value || DEFAULT_END_TIME_STR)}
                      onChange={(v) => field.onChange(v ? v.toString() : "")}
                    />
                  )}
                />
              </div>
            </div>
          ))}
          <div className="mt-4">
            <Controller
              control={control}
              name="applyForWeeks"
              render={({ field }) => (
                <NumberInput
                  hideStepper
                  aria-label="Apply for (weeks)"
                  className="w-sm p-2"
                  errorMessage={errors.applyForWeeks?.message}
                  isInvalid={!!errors?.applyForWeeks}
                  label="Apply for (weeks)"
                  labelPlacement="outside"
                  value={Number(field.value)}
                  onChange={(e) => {
                    field.onChange(Number((e as any).target.value));
                  }}
                />
              )}
            />
          </div>
          <div className="ml-auto space-x-2 flex justify-end">
            {isDirty && (
              <Button
                color="danger"
                size="sm"
                type="reset"
                variant="flat"
                onPress={() => {
                  reset();
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              color="primary"
              isDisabled={!isDirty}
              isLoading={isPending}
              size="sm"
              type="submit"
            >
              Save
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}
