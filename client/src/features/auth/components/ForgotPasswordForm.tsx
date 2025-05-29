import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Link } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { addToast } from "@heroui/toast";

import { authClient } from "@/lib/auth-client";

interface Formdata {
  email: string;
}

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
});

export default function ForgotPasswordForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Formdata>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Formdata> = async (formData) => {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: formData.email,
      type: "forget-password",
    });

    if (error) {
      addToast({
        title: "Forgot Password",
        description: "Something went wrong",
        color: "danger",
      });

      return;
    }

    addToast({
      title: "Forgot Password",
      description:
        "If an account with that email exists, you’ll receive a one-time password (OTP) shortly.",
      color: "success",
    });

    navigate("/auth/reset-password", { state: { email: formData.email } });
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">Forgot Password</h1>
        <p className="text-sm text-default-500">
          Enter your registered email to continue
        </p>
      </div>
      <Form
        className="w-full flex flex-col gap-4 pt-4"
        validationBehavior="native"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          {...register("email")}
          errorMessage={errors.email?.message}
          isInvalid={!!errors.email}
          label="Email"
          name="email"
          placeholder="Enter your email"
          type="text"
          variant="bordered"
        />
        <Button
          className="w-full"
          color="primary"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          type="submit"
        >
          Submit
        </Button>
        <p className="text-sm hover:underline text-right w-full">
          <Link to={"/auth/signin"}>Back to sign in</Link>
        </p>
      </Form>
    </>
  );
}
