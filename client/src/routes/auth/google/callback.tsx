import React from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";

import ScreenLoader from "@/components/ScreenLoader";
import { useSession } from "@/lib/better-auth/auth";
import { useAuthStore } from "@/store/auth-store";
import { Role } from "@/shared/enums/Role";

export const Route = createFileRoute("/auth/google/callback")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isPending } = useSession();
  const { setUser } = useAuthStore();
  const [redirectToHome, setRedirectToHome] = React.useState(false);

  React.useEffect(() => {
    if (data && data.user) {
      setUser({
        ...data.user,
        roles: data.user.roles as Role[],
        createdAt: data.user.createdAt.toISOString(),
        updatedAt: data.user.updatedAt.toISOString(),
      });
      setRedirectToHome(true);
    }
  }, [data, setUser]);

  if (isPending) return <ScreenLoader />;

  if (redirectToHome) return <Navigate to="/home" />;

  return <Navigate to="/auth/sign-in" />;
}
