import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Link } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react/dist/iconify.js";

import { SignUpData } from "../types/auth";
import { signUpSchema } from "../validations/sign-up-schema";
import { useSignUp } from "../hooks/mutations";

import { authClient } from "@/lib/auth-client";

export default function SignUpForm() {
  const signUp = useSignUp();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  });
  const formRef = React.useRef<HTMLFormElement>(null);

  const googleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: import.meta.env.VITE_GOOGLE_AUTH_CALLBACK_URL,
    });
  };

  const onSubmit: SubmitHandler<SignUpData> = async (formData) => {
    signUp.mutate(formData);
    reset();
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">Create Your Account</h1>
        <p className="text-sm text-default-500">
          Sign up for your eduflux account
        </p>
      </div>
      <Form
        ref={formRef}
        className="w-full flex flex-col gap-4 pt-4"
        validationBehavior="native"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          {...register("name")}
          errorMessage={errors.name?.message}
          isInvalid={!!errors.name}
          label="Fullname"
          name="name"
          placeholder="Enter your fullname"
          type="text"
          variant="bordered"
        />
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
        <Input
          {...register("password")}
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password}
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
          variant="bordered"
        />
        <Input
          {...register("confirmPassword")}
          errorMessage={errors.confirmPassword?.message}
          isInvalid={!!errors.confirmPassword}
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          type="password"
          variant="bordered"
        />
        <div className="w-full">
          <Button
            className="w-full"
            color="primary"
            isDisabled={signUp.isPending}
            isLoading={signUp.isPending}
            type="submit"
          >
            Sign up
          </Button>
        </div>
        <div className="w-full">
          <p className="text-center text-sm font-light">Or continue with</p>
        </div>
        <Button
          className="w-full"
          startContent={<Icon icon="flat-color-icons:google" width={24} />}
          variant="bordered"
          onPress={googleLogin}
        >
          Sign in with google
        </Button>
        <div className="w-full">
          <p className="text-sm text-center">
            Already have a account?<Link to="/auth/signin">Sign in</Link>
          </p>
        </div>
      </Form>
    </>
  );
}
