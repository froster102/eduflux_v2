import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { InputOtp } from "@heroui/input-otp";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { addToast } from "@heroui/toast";

import { authClient } from "@/lib/auth-client";

interface FormValues {
  otp: string;
}

export default function VerifyOtpForm() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      otp: "",
    },
  });
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state?.verificationEmail) {
    return <Navigate to={location.state?.from || "/auth/signin"} />;
  }

  const verificationEmail = location.state.verificationEmail as string;

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const { error } = await authClient.emailOtp.verifyEmail({
      email: verificationEmail,
      otp: formData.otp,
    });

    if (error) {
      addToast({
        title: "Email verification",
        description: error.message,
        color: "danger",
      });

      return;
    }

    navigate("/auth/signin", { replace: true });
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">Verify Your Email</h1>
        <p className="text-sm text-default-500">
          Enter your OTP send to your email to continue
        </p>
      </div>
      <Form
        className="w-full flex flex-col gap-4 pt-4"
        validationBehavior="native"
        onSubmit={handleSubmit(onSubmit)}
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
        <Button className="max-w-fit" color="primary" type="submit">
          Verify OTP
        </Button>
      </Form>
    </>
  );
}
