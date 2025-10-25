import { Form } from '@heroui/form';
import { Controller, useForm } from 'react-hook-form';
import { NumberInput } from '@heroui/number-input';
import { DollarSign } from 'lucide-react';
import { Input } from '@heroui/input';
import { Checkbox } from '@heroui/checkbox';
import { TimeInput } from '@heroui/date-input';
import { parseTime } from '@internationalized/date';
import { Select, SelectItem } from '@heroui/select';
import { Button } from '@heroui/button';
import { zodResolver } from '@hookform/resolvers/zod';

import { getAllTimeZones } from '@/utils/date';

import {
  SessionSettingsFormData,
  sessionSettingsSchema,
} from '../../validation/session-schema';
import ScheduleGuidelines from '../SchedulingGuidelines';
import PricingGuidelines from '../PricingGuidelines';

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const DEFAULT_START_TIME_STR = '10:00:00';
const DEFAULT_END_TIME_STR = '23:00:00';

const defaultSessionSetting = {
  currency: 'USD',
  duration: 60,
  weeklySchedules: weekdays.map((_, index) => ({
    dayOfWeek: index,
    enabled: false,
    startTime: DEFAULT_START_TIME_STR,
    endTime: DEFAULT_END_TIME_STR,
  })),
  applyForWeeks: 1,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export default function SessionSettingsForm({
  initialValue,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
  onSubmitHandler,
  isPending,
  classNames,
}: DefaultFormProps<SessionSettingsFormData> & {
  showInfo?: boolean;
  classNames?: {
    container?: string;
    gridLayout?: string;
  };
}) {
  const normalizedInitialValue = initialValue
    ? {
        ...initialValue,
        weeklySchedules: initialValue.weeklySchedules.map((schedule) => ({
          ...schedule,
          startTime: schedule.startTime || DEFAULT_START_TIME_STR,
          endTime: schedule.endTime || DEFAULT_END_TIME_STR,
        })),
      }
    : defaultSessionSetting;
  const {
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<SessionSettingsFormData>({
    defaultValues: normalizedInitialValue,
    resolver: zodResolver(sessionSettingsSchema),
  });

  const watchedDays = watch('weeklySchedules');

  function onSubmit(data: SessionSettingsFormData) {
    onSubmitHandler(data);
    reset(data);
  }

  return (
    <Form
      className={`w-full ${classNames?.container}`}
      validationBehavior="native"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div
        className={`grid gap-2 ${classNames?.gridLayout || 'md:grid-cols-2'}`}
      >
        <div className="flex flex-col gap-4">
          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <NumberInput
                hideStepper
                aria-label="Session Price"
                errorMessage={errors.price?.message}
                isInvalid={!!errors.price}
                label="Price"
                labelPlacement="outside"
                placeholder="e.g., 50.00"
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
            name="currency"
            render={({ field }) => (
              <Input
                isDisabled
                errorMessage={errors.currency?.message}
                isInvalid={!!errors.currency}
                label="Currency"
                labelPlacement="outside"
                placeholder="e.g., USD, EUR, GBP"
                radius="sm"
                type="text"
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
          <Input
            radius="sm"
            {...register('duration', { valueAsNumber: true })}
            isDisabled
            color="default"
            errorMessage={errors.duration?.message}
            isInvalid={!!errors.duration}
            label="Session Duration (minutes)"
            labelPlacement="outside"
            name="sessionDuration"
            placeholder="e.g., 60"
            type="number"
          />
        </div>
        <PricingGuidelines />

        <div className="flex flex-col gap-2">
          {weekdays.map((day, index) => (
            <div key={day} className="flex w-full justify-between">
              <Controller
                control={control}
                name={`weeklySchedules.${index}.enabled`}
                render={({ field }) => (
                  <Checkbox
                    className="flex-shrink-0"
                    isSelected={field.value}
                    onValueChange={(checked) => {
                      field.onChange(checked);
                      if (!checked) {
                        setValue(
                          `weeklySchedules.${index}.startTime`,
                          undefined,
                        );
                        setValue(`weeklySchedules.${index}.endTime`, undefined);
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
                  name={`weeklySchedules.${index}.startTime`}
                  render={({ field }) => (
                    <TimeInput
                      hideTimeZone
                      aria-label={`Start time for ${day}`}
                      className="focus-within:ring-2 rounded-lg focus-within:ring-primary-500"
                      errorMessage={
                        errors.weeklySchedules?.[index]?.startTime?.message
                      }
                      isDisabled={!watchedDays?.[index]?.enabled}
                      isInvalid={!!errors.weeklySchedules?.[index]?.startTime}
                      size="sm"
                      value={parseTime(field.value || DEFAULT_START_TIME_STR)}
                      onChange={(v) => field.onChange(v ? v.toString() : '')}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`weeklySchedules.${index}.endTime`}
                  render={({ field }) => (
                    <TimeInput
                      hideTimeZone
                      aria-label={`Start time for ${day}`}
                      className="focus-within:ring-2 rounded-lg focus-within:ring-primary-500"
                      errorMessage={
                        errors.weeklySchedules?.[index]?.endTime?.message
                      }
                      isDisabled={!watchedDays[index]?.enabled}
                      isInvalid={!!errors.weeklySchedules?.[index]?.endTime}
                      size="sm"
                      value={parseTime(field.value || DEFAULT_END_TIME_STR)}
                      onChange={(v) => field.onChange(v ? v.toString() : '')}
                    />
                  )}
                />
              </div>
            </div>
          ))}
          <Controller
            control={control}
            name="applyForWeeks"
            render={({ field }) => (
              <NumberInput
                hideStepper
                aria-label="Apply for (weeks)"
                className="max-w-xs"
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
          <Controller
            control={control}
            name="timeZone"
            render={({ field }) => (
              <Select
                className="max-w-xs"
                errorMessage={errors.timeZone?.message}
                isInvalid={!!errors.timeZone}
                label="Timezone"
                labelPlacement="outside"
                placeholder="Select your preffered time"
                selectedKeys={new Set([field.value])}
                value={field.value}
                onSelectionChange={(keys) => {
                  field.onChange(keys.anchorKey);
                }}
              >
                {Array.from(getAllTimeZones()).map((timezone) => (
                  <SelectItem key={timezone}>{timezone}</SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
        <ScheduleGuidelines />
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
              if (onCancel) {
                onCancel();
              }
            }}
          >
            {cancelText}
          </Button>
        )}
        <Button
          color="primary"
          disabled={isPending}
          isDisabled={!isDirty}
          isLoading={isPending}
          size="sm"
          type="submit"
        >
          {submitText}
        </Button>
      </div>
    </Form>
  );
}
