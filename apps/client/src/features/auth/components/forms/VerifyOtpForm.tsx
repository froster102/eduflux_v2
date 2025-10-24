import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { InputOtp } from "@heroui/input-otp";
import { useForm, Controller } from "react-hook-form";

export default function VerifyOtpForm({
  onSubmitHandler,
  isPending,
}: DefaultFormProps<VerifyOtpFormData>) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    defaultValues: {
      otp: "",
    },
  });

  return (
    <>
      <Form
        className="w-full flex flex-col gap-4 pt-4"
        validationBehavior="native"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <Controller
          control={control}
          name="otp"
          render={({ field }) => (
            <InputOtp
              {...field}
              errorMessage={errors.otp?.message}
              isInvalid={!!errors.otp}
              length={4}
            />
          )}
          rules={{
            required: "OTP is required",
            minLength: {
              value: 4,
              message: "Please enter a valid OTP",
            },
          }}
        />
        <Button
          className="max-w-fit"
          color="primary"
          isDisabled={isPending}
          isLoading={isPending}
          type="submit"
        >
          Verify OTP
        </Button>
      </Form>
    </>
  );
}
