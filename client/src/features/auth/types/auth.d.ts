export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

export interface ResetPasswordData {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}
