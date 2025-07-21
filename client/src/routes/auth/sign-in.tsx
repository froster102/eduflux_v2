import { createFileRoute } from "@tanstack/react-router";

import SignInForm from "@/features/auth/components/forms/SignInForm";
import { useSignIn } from "@/features/auth/hooks/useSignIn";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const signIn = useSignIn();
  const onSubmit = async (data: SignInFormData) => {
    signIn.mutate(data);
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-default-500">
          Sign in to your eduflux account
        </p>
      </div>
      <SignInForm isPending={signIn.isPending} onSubmitHandler={onSubmit} />
    </div>
  );
}
