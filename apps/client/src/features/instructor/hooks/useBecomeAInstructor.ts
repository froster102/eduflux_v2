import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { addToast } from '@heroui/toast';

import { useAuthStore } from '@/store/auth-store';
import { Role } from '@/shared/enums/Role';

import { becomeAInstructor } from '../services/instructor';

export function useBecomeAInstructor() {
  const navigate = useNavigate();
  const { addUserRole } = useAuthStore();

  return useMutation({
    mutationFn: becomeAInstructor,

    onSuccess: () => {
      addUserRole(Role.INSTRUCTOR);
      addToast({
        color: 'success',
        title: 'Instructor',
        description: 'Congratulations! You are now an instructor.',
      });
      navigate({ to: '/instructor' });
    },
  });
}
