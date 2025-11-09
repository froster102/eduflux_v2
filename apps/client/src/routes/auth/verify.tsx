import { createFileRoute, Navigate } from '@tanstack/react-router';

import VerifyOtpForm from '@/features/auth/components/forms/VerifyOtpForm';
import { useVerificationStore } from '@/store/verification-store';
import { useVerifyOtp } from '@/features/auth/hooks/useVerifyOtp';

export const Route = createFileRoute('/auth/verify')({
  component: RouteComponent,
});

function RouteComponent() {
  const { verificationEmail } = useVerificationStore();
  const verifyOtp = useVerifyOtp();

  if (!verificationEmail) {
    return <Navigate to={'/auth/sign-in'} />;
  }

  const onSubmit = async (data: VerifyOtpFormData) => {
    verifyOtp.mutate({ ...data, email: verificationEmail! });
  };

  return (
    <div>
      {' '}
      <div>
        <h1 className="text-2xl font-semibold">Verify Your Email</h1>
        <p className="text-sm text-default-500">
          Enter your OTP send to your email to continue
        </p>
      </div>
      <VerifyOtpForm
        isPending={verifyOtp.isPending}
        onSubmitHandler={onSubmit}
      />
    </div>
  );
}
