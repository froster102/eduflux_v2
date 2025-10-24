import { useUpdatePassword } from "../hooks/useUpdatePassword";

import PasswordForm from "./forms/PasswordForm";

export default function AccountTab() {
  const updatePassword = useUpdatePassword();

  function onUpdatePasswordHandler(data: UpdatePasswordFormData) {
    updatePassword.mutate({
      newPassword: data.newPassword,
      currentPassword: data.currentPassword,
    });
  }

  return (
    <PasswordForm
      isPending={updatePassword.isPending}
      onSubmitHandler={onUpdatePasswordHandler}
    />
  );
}
