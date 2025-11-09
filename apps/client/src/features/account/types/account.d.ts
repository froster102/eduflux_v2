declare global {
  export type UpdatePasswordFormData = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  };

  export type Session = {
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null | undefined | undefined;
    userAgent?: string | null | undefined | undefined;
    userId: string;
    id: string;
  };
}

export {};
