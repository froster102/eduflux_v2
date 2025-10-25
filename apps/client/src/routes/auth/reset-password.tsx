import { createFileRoute, Navigate } from '@tanstack/react-router';
import React from 'react';

import ResetPasswordForm from '@/features/auth/components/forms/ResetPasswordForm';
import { useVerificationStore } from '@/store/verification-store';
import { useResetPassword } from '@/features/auth/hooks/useResetPassword';
import { useResendOtp } from '@/features/auth/hooks/useResendOtp';

export const Route = createFileRoute('/auth/reset-password')({
  component: RouteComponent,
});

function RouteComponent() {
  const { verificationEmail } = useVerificationStore();
  const resetPassword = useResetPassword();
  const [resendTimer, setResendTimer] = React.useState(30);
  const resendOtp = useResendOtp(() => setResendTimer(30));

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

  if (!verificationEmail) {
    return <Navigate to="/auth/sign-in" />;
  }

  async function handleResendOtp() {
    resendOtp.mutate(verificationEmail!);
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    resetPassword.mutate({
      ...data,
      email: 'location.state.email',
      password: data.newPassword,
    });
  };

  return (
    <div>
      <div className="text-left">
        <h1 className=" md:text-3xl font-bold">Reset Password</h1>
        <p className="text-balance text-default-500">
          Enter your new passoword to continue
        </p>
      </div>
      <ResetPasswordForm
        isPending={resetPassword.isPending}
        isResendOtpPending={resendOtp.isPending}
        resendOtpHandler={handleResendOtp}
        onSubmitHandler={onSubmit}
      />
    </div>
  );
}
