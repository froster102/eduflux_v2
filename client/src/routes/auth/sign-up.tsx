import { createFileRoute } from "@tanstack/react-router";

import SignUpForm from "@/features/auth/components/forms/SignUpForm";
import { useSignUp } from "@/features/auth/hooks/useSignUp";

export const Route = createFileRoute("/auth/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  const signUp = useSignUp();

  const onSubmit = async (data: SignInFormData) => {
    signUp.mutate(data);
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold">Create Your Account</h1>
        <p className="text-sm text-default-500">
          Sign up for your eduflux account
        </p>
      </div>
      <SignUpForm isPending={signUp.isPending} onSubmitHandler={onSubmit} />
    </div>
  );
}
