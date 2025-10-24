import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Loader } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { resetPasswordFormSchema } from "@/features/auth/validations/auth";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/Icons";

export default function ResetPasswordForm({
  onSubmitHandler,
  resendOtpHandler,
  isPending,
  isResendOtpPending,
}: DefaultFormProps<ResetPasswordFormData> & {
  resendOtpHandler: () => void;
  isResendOtpPending: boolean;
}) {
  const [resendTimer, setResendTimer] = React.useState(30);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
  });
  const [isVisible, setIsVisible] = React.useState({
    newPassword: false,
    confirmPassword: false,
  });

  React.useEffect(() => {
    const timeOut = setTimeout(() => {
      setResendTimer((prev) => {
        if (prev > 0) {
          return prev - 1;
        }

        return 0;
      });
    }, 1000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [resendTimer]);

  const toggleVisibility = (token: "newPassword" | "confirmPassword") =>
    setIsVisible((prev) => ({
      ...prev,
      [token]: !prev[token],
    }));

  return (
    <div className="p-5 w-full">
      <Form
        className="w-full flex flex-col gap-4 pt-4"
        validationBehavior="native"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <div className="w-full">
          <Input
            {...register("otp")}
            errorMessage={errors.otp?.message}
            isInvalid={!!errors.otp}
            label="OTP"
            name="otp"
            placeholder="Enter 4 digit OTP sent to your email"
            variant="bordered"
          />
          <button
            className={`w-full flex justify-end ${resendTimer > 0 ? "text-default-500" : ""} text-xs block pt-1 hover:underline transition-all duration-500 text-right`}
            disabled={resendTimer > 0}
            type="button"
            onClick={() => resendOtpHandler()}
          >
            {isResendOtpPending ? (
              <Loader className=" w-4 h-4 animate-spin" />
            ) : (
              <p>Resend OTP {resendTimer > 0 ? `in ${resendTimer}s` : ""}</p>
            )}
          </button>
        </div>
        <div className="w-full relative">
          <Input
            {...register("newPassword")}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => toggleVisibility("newPassword")}
              >
                {isVisible.newPassword ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            errorMessage={errors.newPassword?.message}
            isInvalid={!!errors.newPassword}
            label="Password"
            name="newPassword"
            placeholder="Enter your password"
            type={isVisible.newPassword ? "text" : "password"}
            variant="bordered"
          />
          <Input
            className="pt-4"
            {...register("confirmPassword")}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={() => toggleVisibility("confirmPassword")}
              >
                {isVisible.confirmPassword ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            errorMessage={errors.confirmPassword?.message}
            isInvalid={!!errors.confirmPassword}
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Enter your password"
            type={isVisible.confirmPassword ? "text" : "password"}
            variant="bordered"
          />
        </div>

        <div className="w-full">
          <Button
            className="w-full"
            color="primary"
            isDisabled={isPending}
            isLoading={isPending}
            type="submit"
          >
            Submit
          </Button>
        </div>
        <p className="text-sm hover:underline text-right w-full">
          <Link to={"/auth/sign-in"}>Back to sign in</Link>
        </p>
      </Form>
    </div>
  );
}
