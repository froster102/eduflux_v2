import { addToast } from '@heroui/toast';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { useAuthStore } from '@/store/auth-store';
import { auth } from '@/lib/better-auth/auth';
import { Role } from '@/shared/enums/Role';

import { signIn } from '../services/auth';

const getRoleBasedRoute = (user: User): string => {
  if (user.roles?.includes(Role.ADMIN)) {
    return '/admin';
  }
  if (user.roles?.includes(Role.LEARNER)) {
    return '/home';
  }
  if (user.roles?.includes(Role.INSTRUCTOR)) {
    return '/instructor';
  }

  return '/home';
};

export function useSignIn() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  // const { search } = useLocation();

  // const redirectPath = (search as Record<string, any>)?.redirect;

  return useMutation({
    mutationFn: signIn,
    onSuccess: async (data) => {
      const user = data.user as unknown as User;

      setUser(user);

      const destination = getRoleBasedRoute(user);

      navigate({
        to: destination,
      });
    },

    onError: async (error: BetterAuthError, request) => {
      switch (error.code) {
        case 'EMAIL_NOT_VERIFIED': {
          await auth.emailOtp.sendVerificationOtp({
            email: request.email,
            type: 'email-verification',
          });
          addToast({
            title: 'Sign In',
            description:
              'Please verify your email to sign in, An OTP have been sent to your registered email',
            color: 'warning',
          });
          navigate({
            to: '/auth/sign-in',
          });
          break;
        }
        default: {
          addToast({
            title: 'Sign in',
            description: error.message,
            color: 'danger',
          });
        }
      }
    },
  });
}
