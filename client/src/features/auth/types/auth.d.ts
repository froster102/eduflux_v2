declare global {
  export type SignInFormData = {
    email: string;
    password: string;
  };

  export type SignUpFormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  export type VerifyOtpFormData = {
    otp: string;
  };

  export type ResetPasswordFormData = {
    email: string;
    otp: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
  };

  export type ForgotPasswordFormData = {
    email: string;
  };
}

export {};
