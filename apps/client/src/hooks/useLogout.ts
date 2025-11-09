import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { addToast } from '@heroui/toast';

import { useAuthStore } from '@/store/auth-store';
import { logout } from '@/services/logout';
import { useChatStore } from '@/store/useChatStore';

export function useLogout() {
  const navigate = useNavigate();
  const { signout } = useAuthStore();
  const { resetSelectedChat } = useChatStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate({ to: '/auth/sign-in', replace: true });
      signout();
      resetSelectedChat();
      addToast({
        title: 'Logout',
        description: 'User has been successfully logged out',
        color: 'success',
      });
    },
  });
}
