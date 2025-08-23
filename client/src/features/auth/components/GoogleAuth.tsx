import { Navigate } from "@tanstack/react-router";

import ScreenLoader from "@/components/ScreenLoader";

import { useSession } from "@/lib/auth-client";

export default function GoogleAuth() {
  const { data, isPending } = useSession();

  const from = (data as any as { user: User }).user.roles.includes("LEARNER")
    ? "/learner/"
    : "/auth/sign-in";

  if (isPending) {
    return <ScreenLoader />;
  }

  if (!data) {
    <Navigate to={"/auth/sign-in"} />;
  }

  return <Navigate to={from} />;
}
