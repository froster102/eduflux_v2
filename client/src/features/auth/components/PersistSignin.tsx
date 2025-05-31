import { Outlet, useNavigate } from "react-router";
import React from "react";

import ScreenLoader from "@/components/ScreenLoader";
import { useAuthStore } from "@/store/auth-store";
import { authClient } from "@/lib/auth-client";

export default function PersistSignin() {
  const [isLoading, setIsLoading] = React.useState(true);
  const { user, setUser, signout } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    const verifyAuthStatus = async () => {
      try {
        const { data } = await authClient.getSession();

        if (data === null) {
          signout();
          navigate("/auth/signin");
        } else {
          setUser(data.user as User);
        }
      } catch {
        signout();
        navigate("/auth/signin");
      } finally {
        setIsLoading(false);
      }
    };

    if (!user) {
      verifyAuthStatus();
    } else {
      setIsLoading(false);
    }
  }, [user, signout, navigate]);

  return isLoading ? <ScreenLoader /> : <Outlet />;
}
