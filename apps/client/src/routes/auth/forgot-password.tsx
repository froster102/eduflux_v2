import { createFileRoute } from "@tanstack/react-router";

import ForgotPasswordForm from "@/features/auth/components/forms/ForgotPasswordForm";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

export const Route = createFileRoute("/auth/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  const forgotPassword = useForgotPassword();

  const onSubmit = async (formData: ForgotPasswordFormData) => {
    forgotPassword.mutate(formData.email);
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold">Forgot Password</h1>
        <p className="text-sm text-default-500">
          Enter your registered email to continue
        </p>
      </div>
      <ForgotPasswordForm
        isPending={forgotPassword.isPending}
        onSubmitHandler={onSubmit}
      />
    </div>
  );
}
