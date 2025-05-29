import { Navigate, Outlet, useLocation } from "react-router";

import { useAuthStore } from "@/store/auth-store";

export default function RequireAuth({
  allowedRoles,
}: {
  allowedRoles: Role[];
}) {
  const { user } = useAuthStore();
  const location = useLocation();

  const hasAccess = allowedRoles.some(
    (role) => user && user.roles.includes(role),
  );

  return hasAccess ? (
    <Outlet />
  ) : (
    <Navigate
      replace
      state={{ from: location, role: allowedRoles }}
      to={"/auth/signin"}
    />
  );
}
