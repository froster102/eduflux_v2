import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Link } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForgotPassword } from "../hooks/mutations";

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
    formState: { errors },
  } = useForm<Formdata>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const forgotPassword = useForgotPassword();

  const onSubmit: SubmitHandler<Formdata> = async (formData) => {
    forgotPassword.mutate(formData.email);
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
          isDisabled={forgotPassword.isPending}
          isLoading={forgotPassword.isPending}
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
