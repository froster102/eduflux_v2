import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';

import { forgotPasswordSchema } from '@/features/auth/validations/auth';

export default function ForgotPasswordForm({
  isPending,
  onSubmitHandler,
}: DefaultFormProps<ForgotPasswordFormData>) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  function handleFormSubmit(data: ForgotPasswordFormData) {
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
        <Button
          className="w-full"
          color="primary"
          isDisabled={isPending}
          isLoading={isPending}
          type="submit"
        >
          Submit
        </Button>
        <p className="text-sm hover:underline text-right w-full">
          <Link to={'/auth/sign-in'}>Back to sign in</Link>
        </p>
      </Form>
    </>
  );
}
