import { Outlet, useNavigate } from "react-router";
import React from "react";

import ScreenLoader from "@/components/ScreenLoader";
import { useAuthStore } from "@/store/auth-store";
import { authClient } from "@/lib/auth-client";

export default function PersistSignin() {
  const [isLoading, setIsLoading] = React.useState(true);
  const { user, authToken, setAuthData, signout } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    const verifyAuthStatus = async () => {
      console.log("calling session");
      try {
        await authClient.getSession({
          fetchOptions: {
            onSuccess: (ctx) => {
              const jwt = ctx.response.headers.get("set-auth-jwt");

              if (ctx.data === null) {
                console.log("session not found");
                signout();
                navigate("/auth/signin");
              }
              if (ctx.data?.user && jwt) {
                setAuthData(
                  ctx.data.user as User,
                  ctx.data.session as Session,
                  jwt,
                );
              }
            },
          },
        });
      } catch {
        signout();
        navigate("/auth/signin");
      }
    };

    if (!user && !authToken) {
      verifyAuthStatus();
    } else {
      setIsLoading(false);
    }
  }, [user, authToken, setAuthData, signout, navigate]);

  return isLoading ? <ScreenLoader /> : <Outlet />;
}
