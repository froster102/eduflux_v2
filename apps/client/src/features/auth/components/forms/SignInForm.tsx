import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';

import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/Icons';
import { auth } from '@/lib/better-auth/auth';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { GOOGLE_REDIRECT_URL } from '@/lib/constants';

import { signInSchema } from '../../validations/auth';

export default function SignInForm({
  onSubmitHandler,
  isPending,
}: DefaultFormProps<SignInFormData>) {
  const [isVisible, setIsVisible] = React.useState(false);
  const redirectTo = useLocation() as Record<string, string>;

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const googleLogin = async () => {
    await auth.signIn.social({
      provider: 'google',
      callbackURL: redirectTo?.redirect
        ? GOOGLE_REDIRECT_URL + `${redirectTo?.redirect}`
        : GOOGLE_REDIRECT_URL,
    });
  };

  function handleFormSubmit(data: SignInFormData) {
    onSubmitHandler(data);
    reset();
  }

  return (
    <>
      <Form
        className="w-full flex flex-col gap-4 pt-4"
        validationBehavior="native"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Input
          {...register('email')}
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
          {...register('password')}
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
          type={isVisible ? 'text' : 'password'}
        />
        <p className="text-right w-full text-sm hover:underline">
          <Link to={'/auth/forgot-password'}>Forgot Password</Link>
        </p>
        <div className="w-full">
          <Button
            className="w-full"
            color="primary"
            isDisabled={isPending}
            isLoading={isPending}
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
          startContent={<GoogleIcon width={24} />}
          variant="bordered"
          onPress={googleLogin}
        >
          Sign in with google
        </Button>
        <div className="w-full">
          <p className="text-sm text-center">
            Don&apos;t have a account?<Link to="/auth/sign-up">Sign up</Link>
          </p>
        </div>
      </Form>
    </>
  );
}
