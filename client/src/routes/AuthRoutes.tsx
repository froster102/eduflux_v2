import { Route, Routes } from "react-router";

import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import ResetPasswordPage from "@/pages/auth/ResetPassword";
import SignInPage from "@/pages/auth/SignIn";
import SignUpPage from "@/pages/auth/SignUp";
import NotFoundPage from "@/components/NotFound";
import AccountBlockedPage from "@/pages/auth/AccountBlocked";
import VerifyOtpPage from "@/pages/auth/VerifyOtp";
import GoogleAuth from "@/features/auth/components/GoogleAuth";

export default function AuthRoutes() {
  return (
    <>
      <Routes>
        <Route element={<SignInPage />} path="/signin" />
        <Route element={<GoogleAuth />} path="/google" />
        <Route element={<SignUpPage />} path="/signup" />
        <Route element={<VerifyOtpPage />} path="/verify" />
        <Route element={<ForgotPasswordPage />} path="/forgot-password" />
        <Route element={<ResetPasswordPage />} path="/reset-password" />
        <Route element={<AccountBlockedPage />} path="/account-blocked" />
        <Route element={<NotFoundPage />} />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </>
  );
}
