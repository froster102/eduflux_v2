import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "@tanstack/react-router";

import { signUpSchema } from "../../validations/auth";

import { auth } from "@/lib/better-auth/auth";

export default function SignUpForm({
  onSubmitHandler,
  isPending,
}: DefaultFormProps<SignUpFormData>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const googleLogin = async () => {
    await auth.signIn.social({
      provider: "google",
      callbackURL: import.meta.env.VITE_GOOGLE_AUTH_CALLBACK_URL,
    });
  };

  return (
    <>
      <Form
        className="w-full flex flex-col gap-4 pt-4"
        validationBehavior="native"
        onSubmit={handleSubmit(onSubmitHandler)}
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
            isDisabled={isPending}
            isLoading={isPending}
            type="submit"
            onPress={() => reset()}
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
            Already have a account?<Link to="/auth/sign-in">Sign in</Link>
          </p>
        </div>
      </Form>
    </>
  );
}
