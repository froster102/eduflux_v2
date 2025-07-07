declare global {
  export type UpdatePasswordFormData = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  };
}

export {};
