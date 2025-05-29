import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Link } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react/dist/iconify.js";

import { SignInData } from "../types/auth";
import { signInSchema } from "../validations/sign-in-schema";
import { useSignInMutation } from "../hooks/mutations";

import { EyeFilledIcon, EyeSlashFilledIcon } from "./ResetPasswordForm";

import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { roleBasedRoutes } from "@/config/site";

export default function SignInForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthData } = useAuthStore();
  const signInMutation = useSignInMutation(navigate, location);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  });

  const googleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: import.meta.env.VITE_GOOGLE_AUTH_CALLBACK_URL,
    });
  };

  const onSubmit: SubmitHandler<SignInData> = async (formData) => {
    setIsLoading(true);
    const { data, error } = await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      switch (error.code) {
        case "EMAIL_NOT_VERIFIED": {
          await authClient.emailOtp.sendVerificationOtp({
            email: formData.email,
            type: "email-verification",
          });
          setIsLoading(false);
          navigate("/auth/verify", {
            state: { verificationEmail: formData.email },
          });
          break;
        }
        default: {
          setIsLoading(false);
          addToast({
            title: "Authentication",
            description: error.message,
            color: "danger",
          });
        }
      }
    }

    if (data) {
      await authClient.getSession({
        fetchOptions: {
          onSuccess: (ctx) => {
            const jwt = ctx.response.headers.get("set-auth-jwt");

            setAuthData(
              ctx.data.user as User,
              ctx.data.session as Session,
              jwt!,
            );
          },
        },
      });

      setIsLoading(false);

      const from =
        location.state?.from?.pathname ||
        roleBasedRoutes[(data.user as User).roles[0]];

      navigate(from, { replace: true });
    }

    reset();
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-default-500">
          Sign in to your eduflux account
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
        <Input
          variant="bordered"
          {...register("password")}
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password}
          label="Password"
          name="password"
          placeholder="Enter your password"
          type={isVisible ? "text" : "password"}
        />
        <p className="text-right w-full text-sm hover:underline">
          <Link to={"/auth/forgot-password"}>Forgot Password</Link>
        </p>
        <div className="w-full">
          <Button
            className="w-full"
            color="primary"
            isDisabled={signInMutation.isPending}
            isLoading={isLoading}
            type="submit"
          >
            Sign in
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
            Don&apos;t have a account?<Link to="/auth/signup">Sign up</Link>
          </p>
        </div>
      </Form>
    </>
  );
}
