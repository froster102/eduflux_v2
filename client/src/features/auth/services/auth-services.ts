import { ResetPasswordReq, SignInData, SignUpData } from "../types/auth";

import api from "@/lib/axios";

export function signIn(signInData: SignInData) {
  return api.post("/auth/signin", signInData);
}

export function forgotPassword(email: string) {
  return api.post("/auth/forgot-password", { email });
}

export function signUp(signUpData: SignUpData) {
  return api.post("/auth/signup", signUpData);
}

export function resetPassword(resetPasswordData: ResetPasswordReq) {
  return api.post("/auth/reset-password", resetPasswordData);
}

export function googleSignIn(authCode: string) {
  return api.post("/auth/google/verify-user", { authCode });
}

export function getUserSessions() {
  return api.get<{ sessions: Session[]; currentSession: string }>(
    "/auth/sessions",
  );
}

export function terminateSession(sessionId: string) {
  return api.delete<Session>(`/auth/sessions/${sessionId}`);
}

export function updateUserPassword({
  newPassword,
  currentPassword,
  userId,
}: {
  newPassword: string;
  currentPassword: string;
  userId: string;
}) {
  return api.put(`/auth/users/${userId}/update-password`, {
    newPassword,
    currentPassword,
    userId,
  });
}
