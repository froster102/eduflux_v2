import { auth } from "@/lib/better-auth/auth";
import api from "@/lib/axios";

export async function signIn(signInData: SignInFormData) {
  const { data, error } = await auth.signIn.email({
    email: signInData.email,
    password: signInData.password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signUp(signUpData: SignUpFormData) {
  const { data, error } = await auth.signUp.email({
    email: signUpData.email,
    name: signUpData.name,
    password: signUpData.password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function verifyOtp({
  otp,
  email,
}: {
  otp: string;
  email: string;
}) {
  const { data, error } = await auth.emailOtp.verifyEmail({
    email,
    otp,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function forgotPassword(email: string) {
  const { data, error } = await auth.emailOtp.sendVerificationOtp({
    email: email,
    type: "forget-password",
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function resetPassword({
  email,
  otp,
  password,
}: {
  email: string;
  otp: string;
  password: string;
}) {
  const { data, error } = await auth.emailOtp.resetPassword({
    email,
    otp,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function resendOtp(email: string) {
  const { data, error } = await auth.emailOtp.sendVerificationOtp({
    email,
    type: "forget-password",
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function logout() {
  const { data, error } = await auth.signOut();

  if (error) {
    throw error;
  }

  return data;
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
