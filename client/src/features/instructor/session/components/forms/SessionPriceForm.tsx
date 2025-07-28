import { Divider } from "@heroui/divider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { NumberInput } from "@heroui/number-input";
import { DollarSign } from "lucide-react";

import {
  SessionPricingFormData,
  sessionPricingSchema,
} from "../../validation/session-schema";

export default function SessionPricingForm({
  onSubmitHandler,
  initialValue,
}: DefaultFormProps<SessionPricingFormData>) {
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SessionPricingFormData>({
    resolver: zodResolver(sessionPricingSchema),
    defaultValues: initialValue || {
      currency: "USD",
      duration: 60,
    },
  });

  const onSubmit = (data: SessionPricingFormData) => {
    onSubmitHandler(data);
    reset(data);
  };

  return (
    <div className="lg:flex w-full gap-4">
      <Form
        className="w-full flex flex-col gap-4 pt-4"
        validationBehavior="native"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <NumberInput
              hideStepper
              aria-label="Session Price"
              errorMessage={errors.price?.message}
              isInvalid={!!errors.price}
              label=" Price"
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
          {...register("duration", { valueAsNumber: true })}
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
          <Button color="primary" isDisabled={!isDirty} size="sm" type="submit">
            Save
          </Button>
        </div>
      </Form>

      <div className="w-full flex gap-4 flex-col pt-4">
        <div>
          <p className="font-semibold text-lg">Pricing Guidelines</p>
          <small className="text-zinc-500">
            Consider your expertise, market rates, and target audience when
            setting your session price.
          </small>
        </div>
        <Divider orientation="horizontal" />
        <div>
          <p className="font-semibold text-lg">Review Regularly</p>
          <small className="text-zinc-500">
            Periodically review and adjust your pricing based on demand and
            value provided.
          </small>
        </div>
        <Divider orientation="horizontal" />
        <div>
          <p className="font-semibold text-lg">Currency Choice</p>
          <small className="text-zinc-500">
            Select a currency relevant to your primary client base.
          </small>
        </div>
      </div>
    </div>
  );
}
