import { Navigate, useLocation } from "react-router";

import { useSession } from "@/lib/auth-client";
import ScreenLoader from "@/components/ScreenLoader";
import { roleBasedRoutes } from "@/config/site";

export default function GoogleAuth() {
  const { data, isPending } = useSession();
  const location = useLocation();

  const from =
    location.state?.from?.pathname ||
    roleBasedRoutes[(data?.user as any)?.role as Role];

  if (isPending) {
    return <ScreenLoader />;
  }

  if (!data) {
    <Navigate to={"/auth/signin"} />;
  }

  return <Navigate replace to={from} />;
}
