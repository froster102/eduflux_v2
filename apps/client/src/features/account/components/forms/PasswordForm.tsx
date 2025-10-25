import { Divider } from '@heroui/divider';
import { Input } from '@heroui/input';
import { Form } from '@heroui/form';
import { useForm } from 'react-hook-form';
import { Button } from '@heroui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';

import { EyeFilledIcon, EyeSlashFilledIcon } from '@/components/Icons';

import { updatePasswordSchema } from '../schemas/account-schema';

export default function PasswordForm({
  onSubmitHandler,
  isPending,
}: DefaultFormProps<UpdatePasswordFormData>) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      confirmNewPassword: '',
      currentPassword: '',
      newPassword: '',
    },
  });
  const [passwordVisible, setPasswordVisible] = React.useState<{
    currentPassword: boolean;
    newPassword: boolean;
    confirmNewPassword: boolean;
  }>({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const onSubmit = (data: UpdatePasswordFormData) => {
    onSubmitHandler(data);
    // reset();
  };

  return (
    <div className="md:flex w-full gap-4">
      <Form
        className="w-full flex flex-col gap-4 pt-4"
        validationBehavior="native"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          radius="sm"
          {...register('currentPassword')}
          color="default"
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={() =>
                setPasswordVisible((prev) => ({
                  ...prev,
                  currentPassword: !prev.currentPassword,
                }))
              }
            >
              {passwordVisible.currentPassword ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          errorMessage={errors.currentPassword?.message}
          isInvalid={!!errors.currentPassword}
          label="Current Password"
          labelPlacement="outside"
          name="currentPassword"
          placeholder="Current Password"
          type={passwordVisible.currentPassword ? 'text' : 'password'}
        />
        <Input
          radius="sm"
          {...register('newPassword')}
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={() =>
                setPasswordVisible((prev) => ({
                  ...prev,
                  newPassword: !prev.newPassword,
                }))
              }
            >
              {passwordVisible.newPassword ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          errorMessage={errors.newPassword?.message}
          isInvalid={!!errors.newPassword}
          label="New Password"
          labelPlacement="outside"
          name="newPassword"
          placeholder="New Password"
          type={passwordVisible.newPassword ? 'text' : 'password'}
        />
        <Input
          radius="sm"
          {...register('confirmNewPassword')}
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={() =>
                setPasswordVisible((prev) => ({
                  ...prev,
                  confirmNewPassword: !prev.confirmNewPassword,
                }))
              }
            >
              {passwordVisible.confirmNewPassword ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          errorMessage={errors.confirmNewPassword?.message}
          isInvalid={!!errors.confirmNewPassword}
          label="Confirm New Password"
          labelPlacement="outside"
          name="confirmNewPassword"
          placeholder="Confirm New Password"
          type={passwordVisible.confirmNewPassword ? 'text' : 'password'}
        />
        <div className="ml-auto space-x-2">
          {isDirty && (
            <Button
              color="danger"
              size="sm"
              type="reset"
              variant="flat"
              onPress={() => {
                reset();
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            color="primary"
            isDisabled={!isDirty || isPending}
            isLoading={isPending}
            size="sm"
            type="submit"
          >
            Update Password
          </Button>
        </div>
      </Form>
      <div className="w-full flex gap-4 flex-col pt-4">
        <div>
          <p className="font-semibold text-lg">Letters</p>
          <small className="text-zinc-500">
            Use a number of letters (uppercase or lowercase){' '}
          </small>
        </div>
        <Divider orientation="horizontal" />
        <div>
          <p className="font-semibold text-lg">Numbers</p>
          <small className="text-zinc-500">
            Use a number to enforce your password
          </small>
        </div>
        <Divider orientation="horizontal" />
        <div>
          <p className="font-semibold text-lg">Special character</p>
          <small className="text-zinc-500">
            Use a special characters to make it hard to break
          </small>
        </div>
        <Divider orientation="horizontal" />
        <div>
          <p className="font-semibold text-lg">Random</p>
          <small className="text-zinc-500">
            The more random your password is the more secure it will be
          </small>
        </div>
      </div>
    </div>
  );
}
